"use client";

import type { JSX, ReactNode } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { useUpdateBooking } from "../hooks/useUpdateBooking";
import { bookingToFormValues } from "../utils";
import type { Booking, CreateBookingPayload } from "../types";

interface EditBookingDialogProps {
  booking: Booking;
  trigger: ReactNode;
}

export const EditBookingDialog = ({ booking, trigger }: EditBookingDialogProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateBooking(booking.id);

  const handleSubmit = (payload: CreateBookingPayload): void => {
    mutate(payload, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-quicksand text-xl font-bold text-brown">
            Edit booking
          </DialogTitle>
        </DialogHeader>
        <BookingForm
          initialValues={bookingToFormValues(booking)}
          excludeId={booking.id}
          onSubmit={handleSubmit}
          isPending={isPending}
          onCancel={() => setOpen(false)}
          submitLabel="Save"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDialog;
