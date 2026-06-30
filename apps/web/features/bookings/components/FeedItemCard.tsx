"use client";

import type { JSX } from "react";
import { Lock, Clock, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Booking, FeedItem } from "../types";
import { formatTime, formatDuration } from "../utils";
import { EditBookingDialog } from "./EditBookingDialog";
import { CancelConfirmDialog } from "./CancelConfirmDialog";

interface FeedItemCardProps {
  item: FeedItem;
}

function InProgressBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-2 py-0.5 text-xs font-semibold text-teal">
      <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse inline-block" />
      In progress
    </span>
  );
}

export const FeedItemCard = ({ item }: FeedItemCardProps): JSX.Element => {
  const now = new Date();
  const start = new Date(item.startTime);
  const end = new Date(item.endTime);
  const isInProgress = now >= start && now < end;

  const dayAbbrev = start.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const dayNumber = start.getDate();
  const isGoogle = item.type === "google";

  if (isGoogle) {
    return (
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex min-w-[52px] flex-col items-center justify-center rounded-xl bg-teal/10 px-3 py-2 text-teal">
          <span className="text-xs font-semibold uppercase leading-none">{dayAbbrev}</span>
          <span className="text-xl font-bold leading-tight">{dayNumber}</span>
        </div>
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="card-title truncate text-brown">{item.title}</p>
            <Lock className="h-3 w-3 shrink-0 text-teal" />
            {isInProgress && <InProgressBadge />}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {formatTime(item.startTime)} – {formatTime(item.endTime)}
              {" · "}
              {formatDuration(item.startTime, item.endTime)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const booking: Booking = {
    id: item.id,
    title: item.title,
    description: item.description,
    startTime: item.startTime,
    endTime: item.endTime,
    createdAt: item.startTime,
    updatedAt: item.startTime,
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex min-w-[52px] flex-col items-center justify-center rounded-xl bg-coral/10 px-3 py-2 text-coral">
        <span className="text-xs font-semibold uppercase leading-none">{dayAbbrev}</span>
        <span className="text-xl font-bold leading-tight">{dayNumber}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="card-title truncate text-brown">{item.title}</p>
          {isInProgress && <InProgressBadge />}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>
            {formatTime(item.startTime)} – {formatTime(item.endTime)}
            {" · "}
            {formatDuration(item.startTime, item.endTime)}
          </span>
        </div>
      </div>
      <EditBookingDialog
        booking={booking}
        trigger={
          <Button variant="ghost" size="icon" aria-label="Edit booking">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        }
      />
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

export default FeedItemCard;
