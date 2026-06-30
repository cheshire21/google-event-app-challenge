import api from "@/lib/api";
import type { PagedBookings } from "./types";

export const getBookings = (page = 1, limit = 20): Promise<PagedBookings> =>
  api.get<PagedBookings>("/bookings", { params: { page, limit } }).then((r) => r.data);
