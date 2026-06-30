import { useMemo } from "react";
import { useBookings } from "./useBookings";
import { getMondayOfWeek } from "../utils";

export interface BookingStats {
  upcoming: number;
  thisWeek: number;
  googleSynced: number;
}

export const useBookingStats = (): BookingStats => {
  const { data } = useBookings();

  return useMemo(() => {
    const all = data?.pages.flatMap((p) => p.data) ?? [];
    const now = new Date();

    const startOfWeek = getMondayOfWeek(now);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return {
      upcoming: all.filter((b) => new Date(b.startTime) > now).length,
      thisWeek: all.filter((b) => {
        const t = new Date(b.startTime);
        return t >= startOfWeek && t < endOfWeek;
      }).length,
      googleSynced: 0, // placeholder until BE-2.3
    };
  }, [data]);
};
