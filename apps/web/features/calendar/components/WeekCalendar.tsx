"use client";
import type { JSX } from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import type React from "react";
import { NewBookingDialog } from "@/features/bookings/components/NewBookingDialog";
import type { BookingFormValues } from "@/features/bookings/schemas/booking.schema";
import { getBookingsByDateRange, updateBooking as updateBookingApi } from "@/features/bookings/api";
import type { CreateBookingPayload } from "@/features/bookings/types";
import { WeekNavigator } from "./WeekNavigator";
import { DayColumn } from "./DayColumn";
import { CalendarSkeleton } from "./CalendarSkeleton";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  getMondayOfWeek,
  getWeekDays,
  toLocalISODate,
  getCalendarHours,
  getWeekLabel,
  snapTo15Min,
  pixelToMinutes,
} from "../utils";

interface DragState {
  bookingId: string;
  day: Date;
  originalStart: Date;
  originalEnd: Date;
  currentStart: Date;
  currentEnd: Date;
  grabOffsetMinutes: number;
  columnHeightPx: number;
  durationMs: number;
}

export const WeekCalendar = (): JSX.Element => {
  const [anchor, setAnchor] = useState(() => new Date());
  const [initialTime, setInitialTime] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  const { data: user } = useCurrentUser();
  const days = getWeekDays(anchor);
  const monday = getMondayOfWeek(anchor);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const start = monday.toISOString();
  const end = new Date(new Date(sunday).setHours(23, 59, 59, 999)).toISOString();

  const { events, isLoading } = useCalendarEvents(anchor);

  const { data: rawBookings = [] } = useQuery({
    queryKey: ["bookings", "week", start],
    queryFn: () => getBookingsByDateRange(start, end),
  });

  const queryClient = useQueryClient();
  const { mutate: patchBooking } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateBookingPayload }) =>
      updateBookingApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: () => toast.error("Could not reschedule booking — the time slot may be taken."),
  });

  const today = new Date();

  const goToPrev = useCallback((): void => {
    setAnchor((a) => {
      const d = new Date(a);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const goToNext = useCallback((): void => {
    setAnchor((a) => {
      const d = new Date(a);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  const goToToday = useCallback((): void => setAnchor(new Date()), []);

  const handleEmptyClick = useCallback((time: Date): void => {
    setInitialTime(time);
    setDialogOpen(true);
  }, []);

  const handleDragStart = useCallback(
    (
      bookingId: string,
      e: React.PointerEvent<HTMLDivElement>,
      columnEl: HTMLDivElement,
      day: Date
    ): void => {
      const booking = rawBookings.find((b) => b.id === bookingId);
      if (!booking) return;

      e.preventDefault();

      const rect = columnEl.getBoundingClientRect();
      const columnHeightPx = rect.height;
      const yInColumn = e.clientY - rect.top;

      const originalStart = new Date(booking.startTime);
      const originalEnd = new Date(booking.endTime);
      const durationMs = originalEnd.getTime() - originalStart.getTime();

      const pointerMinutes = snapTo15Min(pixelToMinutes(yInColumn, columnHeightPx));
      const eventStartMinutes = originalStart.getHours() * 60 + originalStart.getMinutes();
      const grabOffsetMinutes = pointerMinutes - eventStartMinutes;

      const newDragState: DragState = {
        bookingId,
        day,
        originalStart,
        originalEnd,
        currentStart: originalStart,
        currentEnd: originalEnd,
        grabOffsetMinutes,
        columnHeightPx,
        durationMs,
      };
      dragStateRef.current = newDragState;
      setDragState(newDragState);
    },
    [rawBookings]
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, columnEl: HTMLDivElement): void => {
      const ds = dragStateRef.current;
      if (!ds) return;

      const rect = columnEl.getBoundingClientRect();
      const yInColumn = e.clientY - rect.top;
      const rawMinutes = pixelToMinutes(yInColumn, rect.height);
      const snappedMinutes = snapTo15Min(rawMinutes) - ds.grabOffsetMinutes;

      const durationMinutes = ds.durationMs / (1000 * 60);
      const clampedStart = Math.max(0, Math.min(1440 - durationMinutes, snappedMinutes));

      const newStart = new Date(ds.day);
      newStart.setHours(0, 0, 0, 0);
      newStart.setMinutes(clampedStart);

      const newEnd = new Date(newStart.getTime() + ds.durationMs);

      const updated = { ...ds, currentStart: newStart, currentEnd: newEnd };
      dragStateRef.current = updated;
      setDragState(updated);
    },
    []
  );

  const handleDragEnd = useCallback((): void => {
    const ds = dragStateRef.current;
    if (!ds) return;

    dragStateRef.current = null;
    setDragState(null);

    if (ds.currentStart.getTime() === ds.originalStart.getTime()) return;

    const booking = rawBookings.find((b) => b.id === ds.bookingId);
    if (!booking) return;

    patchBooking({
      id: ds.bookingId,
      payload: {
        title: booking.title,
        startTime: ds.currentStart.toISOString(),
        endTime: ds.currentEnd.toISOString(),
      },
    });
  }, [rawBookings, patchBooking]);

  const initialValues: Partial<BookingFormValues> | undefined = initialTime
    ? {
        date: initialTime,
        startTime: `${String(initialTime.getHours()).padStart(2, "0")}:00`,
        endTime: `${String(Math.min(initialTime.getHours() + 1, 23)).padStart(2, "0")}:00`,
      }
    : undefined;

  const hours = getCalendarHours();
  const weekLabel = getWeekLabel(monday, sunday);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-quicksand text-3xl font-bold text-brown">This week</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{weekLabel}</p>
        <p className="text-sm text-coral mt-0.5">
          click empty time to book · click a booking to edit · drag to reschedule
        </p>
      </div>

      {/* Legend + Navigator */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-coral inline-block" />
            Your bookings
          </span>
          {user?.hasGoogleCalendar && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-teal inline-block" />
              <Lock className="h-3 w-3" />
              Google Calendar · read-only
            </span>
          )}
        </div>
        <WeekNavigator anchor={anchor} onPrev={goToPrev} onNext={goToNext} onToday={goToToday} />
      </div>

      {/* Calendar grid */}
      {isLoading ? (
        <div className="flex-1 overflow-auto">
          <CalendarSkeleton />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="flex min-w-[600px]">
            {/* Time axis */}
            <div className="w-16 shrink-0">
              <div className="h-8" />
              {hours.map((h) => (
                <div key={h} className="h-14 flex items-start justify-end pr-2 pt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div className="flex flex-1">
              {days.map((day) => {
                const isToday = toLocalISODate(day) === toLocalISODate(today);
                const dayEvents = events.filter(
                  (e) => toLocalISODate(e.startTime) === toLocalISODate(day),
                );
                const dayDragState =
                  dragState && toLocalISODate(dragState.day) === toLocalISODate(day)
                    ? dragState
                    : null;
                return (
                  <div key={day.toISOString()} className="flex-1 flex flex-col min-w-[80px]">
                    {/* Day header */}
                    <div className="h-8 flex flex-col items-center justify-center mb-0.5">
                      <span className="text-xs text-muted-foreground uppercase font-medium">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span
                        className={`text-sm font-bold leading-tight ${
                          isToday
                            ? "bg-coral text-white rounded-full w-6 h-6 flex items-center justify-center"
                            : "text-brown"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                    <DayColumn
                      day={day}
                      events={dayEvents}
                      isToday={isToday}
                      bookings={rawBookings}
                      onEmptyClick={handleEmptyClick}
                      dragState={dayDragState}
                      onBookingDragStart={(bookingId, e, colEl) =>
                        handleDragStart(bookingId, e, colEl, day)
                      }
                      onDragMove={(e, colEl) => handleDragMove(e, colEl)}
                      onDragEnd={handleDragEnd}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hidden NewBookingDialog controlled programmatically */}
      <NewBookingDialog
        trigger={<span className="hidden" />}
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setInitialTime(null);
        }}
        initialValues={initialValues}
      />
    </div>
  );
};

export default WeekCalendar;
