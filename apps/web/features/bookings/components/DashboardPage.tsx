"use client";

import type { JSX } from "react";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { useFeed } from "../hooks/useFeed";
import { getGreeting, getDateLabel } from "../utils";
import { StatsCards } from "./StatsCards";
import { BookingsList } from "./BookingsList";

export const DashboardPage = (): JSX.Element => {
  const { data: user } = useCurrentUser();
  const { data } = useFeed();

  const firstName = user?.name?.split(" ")[0] ?? "";
  const total = data?.pages[0]?.meta.total ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-coral">{getDateLabel()}</p>
        <h1 className="page-heading mt-1 text-brown">
          {getGreeting()}{firstName ? `, ${firstName}` : ""}
        </h1>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Bookings list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-brown">Your bookings</h2>
          <span className="body-text text-muted-foreground">
            {total} {total === 1 ? "item" : "items"}
          </span>
        </div>
        <BookingsList />
      </div>
    </div>
  );
};
