import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { getGoogleEvents } from "../api";
import type { GoogleCalendarEvent } from "../api";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";

export const useGoogleEvents = (
  start: string,
  end: string,
): UseQueryResult<GoogleCalendarEvent[], Error> => {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["googleEvents", start, end],
    queryFn: () => getGoogleEvents(start, end),
    enabled: !!user?.hasGoogleCalendar,
  });
};
