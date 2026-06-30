"use client";
import type { JSX } from "react";
import { Lock } from "lucide-react";
import { EditBookingDialog } from "@/features/bookings/components/EditBookingDialog";
import type { CalendarEvent } from "../types";
import type { Booking } from "@/features/bookings/types";

interface CalendarEventBlockProps {
  event: CalendarEvent;
  topPercent: number;
  heightPercent: number;
  bookingData?: Booking;
}

export const CalendarEventBlock = ({
  event,
  topPercent,
  heightPercent,
  bookingData,
}: CalendarEventBlockProps): JSX.Element => {
  const timeLabel = event.startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (event.type === "booking" && bookingData) {
    return (
      <EditBookingDialog
        booking={bookingData}
        trigger={
          <div
            className="absolute inset-x-0.5 overflow-hidden rounded px-1.5 py-0.5 bg-coral/20 border-l-2 border-coral text-coral cursor-pointer hover:bg-coral/30 transition-colors"
            style={{ top: `${topPercent}%`, height: `${Math.max(heightPercent, 3)}%` }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold truncate leading-tight">{event.title}</p>
            <p className="text-xs opacity-75 leading-tight">{timeLabel}</p>
          </div>
        }
      />
    );
  }

  return (
    <div
      className="absolute inset-x-0.5 overflow-hidden rounded px-1.5 py-0.5 bg-teal/10 border-l-2 border-teal text-teal cursor-default"
      style={{ top: `${topPercent}%`, height: `${Math.max(heightPercent, 3)}%` }}
    >
      <div className="flex items-center gap-0.5">
        <Lock className="h-2.5 w-2.5 shrink-0" />
        <p className="text-xs font-semibold truncate leading-tight">{event.title}</p>
      </div>
      <p className="text-xs opacity-75 leading-tight">{timeLabel}</p>
    </div>
  );
};

export default CalendarEventBlock;
