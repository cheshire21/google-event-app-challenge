import api from "@/lib/api";
import type { AvailabilityResult, Booking, CreateBookingPayload, PagedBookings } from "./types";

export const getBookings = (page = 1, limit = 20): Promise<PagedBookings> =>
  api.get<PagedBookings>("/bookings", { params: { page, limit } }).then((r) => r.data);

export const checkAvailability = (
  start: string,
  end: string,
  excludeId?: string,
): Promise<AvailabilityResult> =>
  api
    .get<AvailabilityResult>("/bookings/availability", { params: { start, end, excludeId } })
    .then((r) => r.data);

export const createBooking = (payload: CreateBookingPayload): Promise<Booking> =>
  api.post<Booking>("/bookings", payload).then((r) => r.data);
