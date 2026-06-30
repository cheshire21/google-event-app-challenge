"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectGoogleCalendar } from "../api";

export const useDisconnectCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectGoogleCalendar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });
};
