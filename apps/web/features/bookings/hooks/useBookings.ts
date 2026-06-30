import { useInfiniteQuery } from "@tanstack/react-query";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { getBookings } from "../api";
import type { PagedBookings } from "../types";

export const useBookings = (): UseInfiniteQueryResult<
  { pages: PagedBookings[]; pageParams: number[] },
  Error
> =>
  useInfiniteQuery({
    queryKey: ["bookings"],
    queryFn: ({ pageParam }) => getBookings(pageParam),
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
