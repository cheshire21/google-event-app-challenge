import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBooking } from "../api";

export const useDeleteBooking = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: () => toast.error("Failed to cancel booking"),
  });
};
