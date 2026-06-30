"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../api";
import type { CreateBookingPayload } from "../types";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
