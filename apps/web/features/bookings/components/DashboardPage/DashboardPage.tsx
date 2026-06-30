"use client";

import type { JSX } from "react";
import { useRef } from "react";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { useFeed } from "../../hooks/useFeed";
import { getGreeting, getDateLabel } from "../../utils";
import { StatsCards } from "../StatsCards";
import { BookingsList } from "../BookingsList";

export const DashboardPage = (): JSX.Element => {
  const { data: user } = useCurrentUser();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();
  const listScrollRef = useRef<HTMLDivElement>(null);

  const firstName = user?.name?.split(" ")[0] ?? "";
  const total = data?.pages[0]?.meta.total ?? 0;
  const items = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="shrink-0">
        <p className="text-sm font-semibold text-coral">{getDateLabel()}</p>
        <h1 className="page-heading mt-1 text-brown">
          {getGreeting()}{firstName ? `, ${firstName}` : ""}
        </h1>
      </div>

      {/* Stats */}
      <div className="shrink-0">
        <StatsCards />
      </div>

      {/* Bookings list — takes remaining space and scrolls */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex shrink-0 items-center justify-between">
          <h2 className="text-base font-semibold text-brown">Your bookings</h2>
          {!isLoading && (
            <span className="body-text text-muted-foreground">
              {total} {total === 1 ? "item" : "items"}
            </span>
          )}
        </div>
        <div ref={listScrollRef} className="flex-1 overflow-y-auto">
          <BookingsList
            items={items}
            isLoading={isLoading}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            scrollRef={listScrollRef}
          />
        </div>
      </div>
    </div>
  );
};
