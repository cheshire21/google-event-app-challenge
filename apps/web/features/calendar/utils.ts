import { getMondayOfWeek, getWeekDays, toLocalISODate } from "@/utils/date";
import type { Booking } from "@/features/bookings/types";
import type { CalendarEvent, GoogleCalendarEventDto } from "./types";

export { getMondayOfWeek, getWeekDays, toLocalISODate };

export const CALENDAR_START_HOUR = 8;
export const CALENDAR_TOTAL_HOURS = 13; // 8 AM → 9 PM

export const getTopPercent = (time: Date): number => {
  const hours = time.getHours() + time.getMinutes() / 60;
  return Math.max(0, ((hours - CALENDAR_START_HOUR) / CALENDAR_TOTAL_HOURS) * 100);
};

export const getHeightPercent = (start: Date, end: Date): number => {
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return Math.max(1, (durationHours / CALENDAR_TOTAL_HOURS) * 100);
};

export const bookingToCalendarEvent = (booking: Booking): CalendarEvent => ({
  id: booking.id,
  title: booking.title,
  startTime: new Date(booking.startTime),
  endTime: new Date(booking.endTime),
  type: "booking",
});

export const googleEventToCalendarEvent = (event: GoogleCalendarEventDto): CalendarEvent => ({
  id: event.id,
  title: event.title,
  startTime: new Date(event.startTime),
  endTime: new Date(event.endTime),
  type: "google",
});
