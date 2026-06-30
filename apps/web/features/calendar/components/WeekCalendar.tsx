"use client";
import type { JSX } from "react";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { NewBookingDialog } from "@/features/bookings/components/NewBookingDialog";
import type { BookingFormValues } from "@/features/bookings/schemas/booking.schema";
import { getBookingsByDateRange } from "@/features/bookings/api";
import { WeekNavigator } from "./WeekNavigator";
import { DayColumn } from "./DayColumn";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  getMondayOfWeek,
  getWeekDays,
  toLocalISODate,
  getCalendarHours,
  getWeekLabel,
} from "../utils";

export const WeekCalendar = (): JSX.Element => {
  const [anchor, setAnchor] = useState(() => new Date());
  const [initialTime, setInitialTime] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: user } = useCurrentUser();
  const days = getWeekDays(anchor);
  const monday = getMondayOfWeek(anchor);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const start = monday.toISOString();
  const end = new Date(new Date(sunday).setHours(23, 59, 59, 999)).toISOString();

  const { events } = useCalendarEvents(anchor);

  const { data: rawBookings = [] } = useQuery({
    queryKey: ["bookings", "week", start],
    queryFn: () => getBookingsByDateRange(start, end),
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
      <div className="flex-1 overflow-auto">
        <div className="flex min-w-[600px]">
          {/* Time axis */}
          <div className="w-16 shrink-0">
            <div className="h-8" />
            {hours.map((h) => (
              <div key={h} className="h-14 flex items-start justify-end pr-2 pt-0.5">
                <span className="text-xs text-muted-foreground">
                  {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
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
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
