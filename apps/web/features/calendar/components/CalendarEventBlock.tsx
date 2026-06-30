"use client";
import type { JSX } from "react";
import type React from "react";
import { useRef } from "react";
import { Lock } from "lucide-react";
import { EditBookingDialog } from "@/features/bookings/components/EditBookingDialog";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "../types";
import type { Booking } from "@/features/bookings/types";

interface CalendarEventBlockProps {
  event: CalendarEvent;
  topPercent: number;
  heightPercent: number;
  bookingData?: Booking;
  onDragStart?: (e: React.PointerEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

export const CalendarEventBlock = ({
  event,
  topPercent,
  heightPercent,
  bookingData,
  onDragStart,
  isDragging,
}: CalendarEventBlockProps): JSX.Element => {
  const hasDraggedRef = useRef(false);

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
            role="button"
            tabIndex={0}
            aria-label={`Edit booking: ${event.title}`}
            className={cn(
              "absolute inset-x-0.5 overflow-hidden rounded px-1.5 py-0.5 bg-coral/20 border-l-2 border-coral text-coral hover:bg-coral/30 transition-colors",
              isDragging ? "opacity-60 cursor-grabbing" : "cursor-grab"
            )}
            style={{ top: `${topPercent}%`, height: `${Math.max(heightPercent, 3)}%` }}
            onPointerDown={(e) => {
              hasDraggedRef.current = false;
              e.stopPropagation();
              e.currentTarget.setPointerCapture(e.pointerId);
              onDragStart?.(e);
            }}
            onPointerMove={(e) => {
              if (Math.abs(e.movementX) + Math.abs(e.movementY) > 4) {
                hasDraggedRef.current = true;
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (hasDraggedRef.current) {
                e.preventDefault();
                hasDraggedRef.current = false;
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
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
