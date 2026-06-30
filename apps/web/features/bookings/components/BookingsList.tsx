"use client";

import type { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useFeed } from "../hooks/useFeed";
import { FeedItemCard } from "./FeedItemCard";
import { EmptyState } from "./EmptyState";

const BookingCardSkeleton = (): JSX.Element => (
  <Skeleton className="h-[76px] w-full rounded-xl" />
);

export const BookingsList = (): JSX.Element => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeed();

  const sentinelRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage,
  );

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <FeedItemCard key={item.id} item={item} />
      ))}
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && <BookingCardSkeleton />}
    </div>
  );
};
