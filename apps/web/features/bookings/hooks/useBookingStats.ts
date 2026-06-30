import { useMemo } from "react";
import { useBookings } from "./useBookings";
import { getMondayOfWeek } from "../utils";
import { useGoogleEvents } from "@/features/google-calendar/hooks/useGoogleEvents";

export interface BookingStats {
  upcoming: number;
  thisWeek: number;
  googleSynced: number;
}

export const useBookingStats = (): BookingStats => {
  const { data } = useBookings();

  const { startOfWeek, endOfWeek } = useMemo(() => {
    const now = new Date();
    const sow = getMondayOfWeek(now);
    const eow = new Date(sow);
    eow.setDate(sow.getDate() + 7);
    return { startOfWeek: sow, endOfWeek: eow };
  }, []);

  const { data: googleEvents } = useGoogleEvents(
    startOfWeek.toISOString(),
    endOfWeek.toISOString(),
  );

  return useMemo(() => {
    const all = data?.pages.flatMap((p) => p.data) ?? [];
    const current = new Date();

    return {
      upcoming: all.filter((b) => new Date(b.startTime) > current).length,
      thisWeek: all.filter((b) => {
        const t = new Date(b.startTime);
        return t >= startOfWeek && t < endOfWeek;
      }).length,
      googleSynced: googleEvents?.length ?? 0,
    };
  }, [data, googleEvents, startOfWeek, endOfWeek]);
};
