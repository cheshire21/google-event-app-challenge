import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { GoogleCalendarService } from './google-calendar.service';
import { CalendarEventDto } from './dto/calendar-event.dto';

@ApiTags('google')
@Controller('google')
export class GoogleCalendarController {
  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly config: ConfigService,
  ) {}

  @Get('auth-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ schema: { properties: { url: { type: 'string' } } } })
  getAuthUrl(@CurrentUser() user: { userId: string }) {
    const url = this.googleCalendarService.generateAuthUrl(user.userId);
    return { url };
  }

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const redirectUrl = await this.googleCalendarService.handleCallback(
        code,
        state,
      );
      return res.redirect(redirectUrl);
    } catch {
      const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
      return res.redirect(`${frontendUrl}/calendar?error=true`);
    }
  }

  @Delete('disconnect')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  disconnect(@CurrentUser() user: { userId: string }) {
    return this.googleCalendarService.disconnectCalendar(user.userId);
  }

  @Get('events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [CalendarEventDto] })
  getEvents(
    @CurrentUser() user: { userId: string },
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.googleCalendarService.getEvents(user.userId, start, end);
  }
}
