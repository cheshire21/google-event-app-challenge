import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { getFeed } from "../api";
import type { PagedFeed } from "../types";

export const useFeed = (): UseInfiniteQueryResult<
  { pages: PagedFeed[]; pageParams: number[] },
  Error
> => {
  // Computed once per mount so the queryKey is stable within a session
  const startFrom = useMemo(() => new Date().toISOString(), []);

  return useInfiniteQuery({
    queryKey: ["feed", startFrom],
    queryFn: ({ pageParam }) => getFeed(pageParam, 20, startFrom),
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
};
