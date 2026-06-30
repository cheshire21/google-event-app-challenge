import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../api";
import type { Booking } from "../types";

export const useBooking = (id: string) =>
  useQuery<Booking>({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
  });
