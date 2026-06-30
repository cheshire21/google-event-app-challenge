import type { Booking } from "./types";
import type { BookingFormValues } from "./schemas/booking.schema";
import { toLocalISODate, getMondayOfWeek, getWeekDays } from "@/utils/date";

export { toLocalISODate, getMondayOfWeek, getWeekDays };

export const bookingToFormValues = (booking: Booking): BookingFormValues => ({
  title: booking.title,
  date: new Date(booking.startTime),
  startTime: new Date(booking.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
  endTime: new Date(booking.endTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
});

export const formatTime = (iso: string): string =>
  new Date(iso)
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(":00", "");

export const formatDuration = (start: string, end: string): string => {
  const mins = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

export const buildISODateTime = (dateStr: string, time: string): string => {
  const dateParts = dateStr.split("-");
  const timeParts = time.split(":");
  return new Date(
    Number(dateParts[0]),
    Number(dateParts[1]) - 1,
    Number(dateParts[2]),
    Number(timeParts[0]),
    Number(timeParts[1]),
    0,
  ).toISOString();
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const getDateLabel = (): string => {
  const raw = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return raw.toUpperCase().replace(", ", " · ");
};
