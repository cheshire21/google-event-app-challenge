import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CalendarEventDto } from './dto/calendar-event.dto';

@Injectable()
export class GoogleCalendarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private createOAuthClient() {
    return new google.auth.OAuth2(
      this.config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      this.config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      this.config.getOrThrow<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  generateAuthUrl(userId: string): string {
    const oauth2Client = this.createOAuthClient();
    const state = jwt.sign(
      { userId },
      this.config.getOrThrow<string>('JWT_SECRET'),
      { expiresIn: '10m' },
    );
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      state,
      prompt: 'consent',
    });
  }

  async handleCallback(code: string, state: string): Promise<string> {
    const payload = jwt.verify(
      state,
      this.config.getOrThrow<string>('JWT_SECRET'),
    ) as { userId: string };
    const oauth2Client = this.createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    await this.prisma.user.update({
      where: { id: payload.userId },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token ?? undefined,
        googleTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
        hasGoogleCalendar: true,
      },
    });
    return `${this.config.getOrThrow<string>('FRONTEND_URL')}/connect?connected=true`;
  }

  async getEvents(
    userId: string,
    startTime: string,
    endTime: string,
  ): Promise<CalendarEventDto[]> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    if (!user.hasGoogleCalendar || !user.googleAccessToken) {
      throw new BadRequestException('Google Calendar not connected');
    }
    const oauth2Client = this.createOAuthClient();
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
      expiry_date: user.googleTokenExpiry?.getTime(),
    });
    if (user.googleTokenExpiry && user.googleTokenExpiry < new Date()) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: credentials.access_token,
          googleTokenExpiry: credentials.expiry_date
            ? new Date(credentials.expiry_date)
            : undefined,
        },
      });
      oauth2Client.setCredentials(credentials);
    }
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return (res.data.items ?? [])
      .filter((e) => e.start?.dateTime && e.end?.dateTime)
      .map((e) => ({
        id: e.id ?? '',
        title: e.summary ?? '(No title)',
        startTime: e.start!.dateTime!,
        endTime: e.end!.dateTime!,
        type: 'google' as const,
      }));
  }

  async disconnectCalendar(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpiry: null,
        hasGoogleCalendar: false,
      },
    });
  }
}
