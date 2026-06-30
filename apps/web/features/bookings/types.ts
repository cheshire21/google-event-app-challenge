export interface Booking {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PagedBookings {
  data: Booking[];
  meta: PageMeta;
}

export interface ConflictEntry {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "booking";
}

export interface AvailabilityResult {
  available: boolean;
  conflicts: ConflictEntry[];
}

export interface CreateBookingPayload {
  title: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
}
