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
import { useCreateBooking } from "../hooks/useCreateBooking";
import type { CreateBookingPayload } from "../types";

interface NewBookingDialogProps {
  trigger: ReactNode;
}

export const NewBookingDialog = ({ trigger }: NewBookingDialogProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateBooking();

  const handleSubmit = (payload: CreateBookingPayload): void => {
    mutate(payload, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-quicksand text-xl font-bold text-brown">
            New booking
          </DialogTitle>
        </DialogHeader>
        <BookingForm
          onSubmit={handleSubmit}
          isPending={isPending}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewBookingDialog;
