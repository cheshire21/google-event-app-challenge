import api from "@/lib/api";
import type { AvailabilityResult, Booking, CreateBookingPayload, PagedBookings } from "./types";

export const getBookings = (page = 1, limit = 20): Promise<PagedBookings> =>
  api.get<PagedBookings>("/bookings", { params: { page, limit } }).then((r) => r.data);

export const getBookingsByDateRange = (start: string, end: string): Promise<Booking[]> =>
  api
    .get<{ data: Booking[]; meta: unknown }>("/bookings", {
      params: { startFrom: start, startTo: end, limit: 100 },
    })
    .then((r) => r.data.data);

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

export const getBookingById = (id: string): Promise<Booking> =>
  api.get<Booking>(`/bookings/${id}`).then((r) => r.data);

export const updateBooking = (id: string, payload: CreateBookingPayload): Promise<Booking> =>
  api.patch<Booking>(`/bookings/${id}`, payload).then((r) => r.data);

export const deleteBooking = (id: string): Promise<void> =>
  api.delete(`/bookings/${id}`).then((r) => r.data);
