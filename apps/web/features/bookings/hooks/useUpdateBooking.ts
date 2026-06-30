import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../api";
import type { CreateBookingPayload } from "../types";

export const useUpdateBooking = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => updateBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
