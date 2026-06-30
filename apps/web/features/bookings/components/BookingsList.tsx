"use client";

import type { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useBookings } from "../hooks/useBookings";
import { BookingCard } from "./BookingCard";
import { EmptyState } from "./EmptyState";

const BookingCardSkeleton = (): JSX.Element => (
  <Skeleton className="h-[76px] w-full rounded-xl" />
);

export const BookingsList = (): JSX.Element => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBookings();

  const sentinelRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage,
  );

  const bookings = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    );
  }

  if (bookings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && <BookingCardSkeleton />}
    </div>
  );
};
