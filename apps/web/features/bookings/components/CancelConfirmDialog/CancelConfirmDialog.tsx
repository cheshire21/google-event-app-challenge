"use client";

import type { JSX, ReactNode } from "react";
import { useState } from "react";
import { Trash2, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteBooking } from "../../hooks/useDeleteBooking";
import { formatTime } from "../../utils";
import type { Booking } from "../../types";

interface CancelConfirmDialogProps {
  booking: Booking;
  trigger: ReactNode;
}

export const CancelConfirmDialog = ({
  booking,
  trigger,
}: CancelConfirmDialogProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteBooking(booking.id);
  const start = new Date(booking.startTime);
  const dayLabel = start.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral">
          <Trash2 className="h-6 w-6" />
        </div>
        <DialogHeader>
          <DialogTitle className="font-quicksand text-xl font-bold text-brown text-center">
            Cancel this booking?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will permanently remove your booking. This can&apos;t be undone.
        </p>
        <div className="rounded-lg border bg-cream/40 px-4 py-3 text-left">
          <p className="font-semibold text-brown">{booking.title}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {dayLabel} · {formatTime(booking.startTime)} –{" "}
              {formatTime(booking.endTime)}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Keep it
          </Button>
          <Button
            className="flex-1 bg-coral text-white hover:bg-coral/90"
            onClick={() =>
              mutate(undefined, { onSuccess: () => setOpen(false) })
            }
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
            {isPending ? "Cancelling…" : "Cancel booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmDialog;
