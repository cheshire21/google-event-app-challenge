"use client";
import type { JSX } from "react";
import type React from "react";
import {
  CALENDAR_START_HOUR,
  CALENDAR_TOTAL_HOURS,
  getCalendarHours,
  getTopPercent,
  getHeightPercent,
} from "../utils";
import { CalendarEventBlock } from "./CalendarEventBlock";
import type { CalendarEvent } from "../types";
import type { Booking } from "@/features/bookings/types";

interface DayColumnProps {
  day: Date;
  events: CalendarEvent[];
  isToday: boolean;
  bookings: Booking[];
  onEmptyClick: (time: Date) => void;
}

export const DayColumn = ({
  day,
  events,
  bookings,
  onEmptyClick,
}: DayColumnProps): JSX.Element => {
  const hours = getCalendarHours();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if ((e.target as HTMLElement).closest('[role="dialog"]')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const pct = y / rect.height;
    const hour = Math.floor(CALENDAR_START_HOUR + pct * CALENDAR_TOTAL_HOURS);
    const clicked = new Date(day);
    clicked.setHours(Math.min(hour, CALENDAR_START_HOUR + CALENDAR_TOTAL_HOURS - 1), 0, 0, 0);
    onEmptyClick(clicked);
  };

  return (
    <div className="relative flex-1 border-l border-border" onClick={handleClick}>
      {hours.map((h) => (
        <div key={h} className="h-14 border-b border-border/50" />
      ))}
      {events.map((event) => {
        const top = getTopPercent(event.startTime);
        const height = getHeightPercent(event.startTime, event.endTime);
        const bookingData =
          event.type === "booking" ? bookings.find((b) => b.id === event.id) : undefined;
        return (
          <CalendarEventBlock
            key={event.id}
            event={event}
            topPercent={top}
            heightPercent={height}
            bookingData={bookingData}
          />
        );
      })}
    </div>
  );
};

export default DayColumn;
