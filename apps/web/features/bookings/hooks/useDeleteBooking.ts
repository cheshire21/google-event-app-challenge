import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../api";

export const useDeleteBooking = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
