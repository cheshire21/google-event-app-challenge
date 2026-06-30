"use client";

import type { JSX } from "react";
import { CalendarDays, Calendar, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useBookingStats } from "../hooks/useBookingStats";

export const StatsCards = (): JSX.Element => {
  const { upcoming, thisWeek, googleSynced } = useBookingStats();

  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      <Card className="flex min-w-[160px] flex-1 flex-col gap-3 rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-coral" />
          <span>Upcoming</span>
        </div>
        <p className="text-3xl font-bold text-brown">{upcoming}</p>
      </Card>

      <Card className="flex min-w-[160px] flex-1 flex-col gap-3 rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-coral" />
          <span>This week</span>
        </div>
        <p className="text-3xl font-bold text-brown">{thisWeek}</p>
      </Card>

      <Card className="flex min-w-[160px] flex-1 flex-col gap-3 rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 text-teal" />
          <span>Google synced</span>
        </div>
        <p className="text-3xl font-bold text-brown">{googleSynced}</p>
      </Card>
    </div>
  );
};
