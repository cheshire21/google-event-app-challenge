import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { GoogleCalendarService } from '@/google-calendar/google-calendar.service';
import { AvailabilityResponseDto } from './dto/availability-response.dto';

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async checkAvailability(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string,
  ): Promise<AvailabilityResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { hasGoogleCalendar: true },
    });

    const overlapping = await this.prisma.booking.findMany({
      where: {
        userId,
        ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    const bookingConflicts = overlapping.map((b) => ({
      id: b.id,
      title: b.title,
      startTime: b.startTime,
      endTime: b.endTime,
      type: 'booking' as const,
    }));

    let googleConflicts: Array<{
      id: string;
      title: string;
      startTime: Date;
      endTime: Date;
      type: 'google';
    }> = [];

    if (user?.hasGoogleCalendar) {
      try {
        const events = await this.googleCalendarService.getEvents(
          userId,
          startTime.toISOString(),
          endTime.toISOString(),
        );
        googleConflicts = events
          .filter(
            (event) =>
              new Date(event.startTime) < endTime &&
              new Date(event.endTime) > startTime,
          )
          .map((event) => ({
            id: event.id,
            title: event.title,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
            type: 'google' as const,
          }));
      } catch (err) {
        this.logger.error('Failed to fetch Google Calendar events', err);
      }
    }

    const allConflicts = [...bookingConflicts, ...googleConflicts];

    return plainToInstance(
      AvailabilityResponseDto,
      {
        available: allConflicts.length === 0,
        conflicts: allConflicts,
      },
      { excludeExtraneousValues: true },
    );
  }
}
