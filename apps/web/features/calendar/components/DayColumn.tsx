"use client";
import type { JSX } from "react";
import type React from "react";
import { useRef } from "react";
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
  dragState?: {
    bookingId: string;
    currentStart: Date;
    currentEnd: Date;
  } | null;
  onBookingDragStart?: (
    bookingId: string,
    e: React.PointerEvent<HTMLDivElement>,
    columnEl: HTMLDivElement
  ) => void;
  onDragMove?: (e: React.PointerEvent<HTMLDivElement>, columnEl: HTMLDivElement) => void;
  onDragEnd?: () => void;
}

export const DayColumn = ({
  day,
  events,
  bookings,
  onEmptyClick,
  dragState,
  onBookingDragStart,
  onDragMove,
  onDragEnd,
}: DayColumnProps): JSX.Element => {
  const hours = getCalendarHours();
  const colRef = useRef<HTMLDivElement>(null);

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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (colRef.current) {
      onDragMove?.(e, colRef.current);
    }
  };

  const handlePointerUp = (): void => {
    onDragEnd?.();
  };

  return (
    <div
      ref={colRef}
      className="relative flex-1 border-l border-border"
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {hours.map((h) => (
        <div key={h} className="h-14 border-b border-border/50" />
      ))}
      {events.map((event) => {
        const isDragging = dragState != null && dragState.bookingId === event.id;
        const startTime = isDragging && dragState ? dragState.currentStart : event.startTime;
        const endTime = isDragging && dragState ? dragState.currentEnd : event.endTime;
        const top = getTopPercent(startTime);
        const height = getHeightPercent(startTime, endTime);
        const bookingData =
          event.type === "booking" ? bookings.find((b) => b.id === event.id) : undefined;
        return (
          <CalendarEventBlock
            key={event.id}
            event={event}
            topPercent={top}
            heightPercent={height}
            bookingData={bookingData}
            isDragging={isDragging}
            onDragStart={
              event.type === "booking"
                ? (e) => {
                    if (colRef.current) {
                      onBookingDragStart?.(event.id, e, colRef.current);
                    }
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
};

export default DayColumn;
