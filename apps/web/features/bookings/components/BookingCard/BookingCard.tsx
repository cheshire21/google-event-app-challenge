"use client";

import type { JSX } from "react";
import { Pencil, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Booking } from "../../types";
import { formatTime, formatDuration } from "../../utils";
import { EditBookingDialog } from "../EditBookingDialog";
import { CancelConfirmDialog } from "../CancelConfirmDialog";

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard = ({ booking }: BookingCardProps): JSX.Element => {
  const start = new Date(booking.startTime);
  const dayAbbrev = start
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const dayNumber = start.getDate();

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
      {/* Date block */}
      <div className="flex min-w-[52px] flex-col items-center justify-center rounded-xl bg-coral/10 px-3 py-2 text-coral">
        <span className="text-xs font-semibold uppercase leading-none">
          {dayAbbrev}
        </span>
        <span className="text-xl font-bold leading-tight">{dayNumber}</span>
      </div>

      {/* Booking info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="card-title truncate text-brown">{booking.title}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            {" · "}
            {formatDuration(booking.startTime, booking.endTime)}
          </span>
        </div>
      </div>

      {/* Edit button */}
      <EditBookingDialog
        booking={booking}
        trigger={
          <Button variant="ghost" size="icon" aria-label="Edit booking">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        }
      />

      {/* Cancel button */}
      <CancelConfirmDialog
        booking={booking}
        trigger={
          <Button variant="outline" size="sm">
            <X className="h-3.5 w-3.5" />
            Cancel
          </Button>
        }
      />
    </div>
  );
};
