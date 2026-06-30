"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getMondayOfWeek,
  bookingToCalendarEvent,
  googleEventToCalendarEvent,
} from "../utils";
import { getBookingsByDateRange } from "@/features/bookings/api";
import { getGoogleCalendarEvents } from "../api";
import { useCurrentUser } from "./useCurrentUser";
import type { CalendarEvent } from "../types";

export const useCalendarEvents = (
  anchor: Date,
): { events: CalendarEvent[]; isLoading: boolean } => {
  const { data: user } = useCurrentUser();
  const monday = getMondayOfWeek(anchor);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const start = monday.toISOString();
  const end = new Date(sunday.setHours(23, 59, 59, 999)).toISOString();

  const bookingsQuery = useQuery({
    queryKey: ["bookings", "week", start],
    queryFn: () => getBookingsByDateRange(start, end),
  });

  const googleQuery = useQuery({
    queryKey: ["google-events", start],
    queryFn: () => getGoogleCalendarEvents(start, end),
    enabled: user?.hasGoogleCalendar ?? false,
  });

  const events: CalendarEvent[] = [
    ...(bookingsQuery.data ?? []).map(bookingToCalendarEvent),
    ...(googleQuery.data ?? []).map(googleEventToCalendarEvent),
  ];

  return { events, isLoading: bookingsQuery.isLoading };
};
