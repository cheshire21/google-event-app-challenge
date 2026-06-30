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
import { BookingForm } from "../BookingForm";
import { useCreateBooking } from "../../hooks/useCreateBooking";
import type { CreateBookingPayload } from "../../types";
import type { BookingFormValues } from "../../schemas/booking.schema";

interface NewBookingDialogProps {
  trigger: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialValues?: Partial<BookingFormValues>;
}

export const NewBookingDialog = ({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialValues,
}: NewBookingDialogProps): JSX.Element => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { mutate, isPending } = useCreateBooking();

  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (value: boolean): void => {
    if (!isControlled) setInternalOpen(value);
    controlledOnOpenChange?.(value);
  };

  const handleSubmit = (payload: CreateBookingPayload): void => {
    mutate(payload, {
      onSuccess: () => handleOpenChange(false),
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-quicksand text-xl font-bold text-brown">
            New booking
          </DialogTitle>
        </DialogHeader>
        <BookingForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isPending={isPending}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewBookingDialog;
