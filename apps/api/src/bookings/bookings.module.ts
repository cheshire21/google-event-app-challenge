import { Module } from '@nestjs/common';
import { GoogleCalendarModule } from '@/google-calendar/google-calendar.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { AvailabilityService } from './availability.service';

@Module({
  imports: [GoogleCalendarModule],
  controllers: [BookingsController],
  providers: [BookingsService, AvailabilityService],
})
export class BookingsModule {}
