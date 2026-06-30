import { useQuery } from "@tanstack/react-query";
import { checkAvailability } from "../api";
import type { AvailabilityResult } from "../types";

export const useCheckAvailability = (
  start?: string,
  end?: string,
  excludeId?: string,
) =>
  useQuery<AvailabilityResult>({
    queryKey: ["availability", start, end, excludeId],
    queryFn: () => checkAvailability(start ?? "", end ?? "", excludeId),
    enabled: !!start && !!end,
    staleTime: 0,
  });
