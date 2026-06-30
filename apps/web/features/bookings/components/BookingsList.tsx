"use client";

import type { JSX } from "react";
import type React from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { FeedItem } from "../types";
import { FeedItemCard } from "./FeedItemCard";
import { EmptyState } from "./EmptyState";
import { BookingCardSkeleton, BookingListSkeleton } from "./BookingSkeletons";

interface BookingsListProps {
  items: FeedItem[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  scrollRef?: React.RefObject<HTMLElement | null>;
}

export const BookingsList = ({
  items,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  scrollRef,
}: BookingsListProps): JSX.Element => {
  const sentinelRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage,
    scrollRef,
  );

  if (isLoading) {
    return <BookingListSkeleton />;
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
