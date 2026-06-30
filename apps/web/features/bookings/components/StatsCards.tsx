"use client";

import type { JSX } from "react";
import { CalendarDays, Calendar, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useBookingStats } from "../hooks/useBookingStats";

export const StatsCards = (): JSX.Element => {
  const { upcoming, thisWeek, googleSynced } = useBookingStats();

  return (
    <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-4">
      <Card className="flex flex-col gap-1.5 rounded-xl p-2 xs:gap-2 xs:p-3 sm:gap-3 sm:p-5">
        <div className="flex items-center gap-1 text-[10px] leading-tight text-muted-foreground xs:text-xs sm:gap-2 sm:text-sm">
          <CalendarDays className="h-3 w-3 shrink-0 text-coral xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
          <span className="leading-tight">Upcoming</span>
        </div>
        <p className="text-xl font-bold text-brown xs:text-2xl sm:text-3xl">{upcoming}</p>
      </Card>

      <Card className="flex flex-col gap-1.5 rounded-xl p-2 xs:gap-2 xs:p-3 sm:gap-3 sm:p-5">
        <div className="flex items-center gap-1 text-[10px] leading-tight text-muted-foreground xs:text-xs sm:gap-2 sm:text-sm">
          <Calendar className="h-3 w-3 shrink-0 text-coral xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
          <span className="leading-tight">This week</span>
        </div>
        <p className="text-xl font-bold text-brown xs:text-2xl sm:text-3xl">{thisWeek}</p>
      </Card>

      <Card className="flex flex-col gap-1.5 rounded-xl p-2 xs:gap-2 xs:p-3 sm:gap-3 sm:p-5">
        <div className="flex items-center gap-1 text-[10px] leading-tight text-muted-foreground xs:text-xs sm:gap-2 sm:text-sm">
          <RefreshCw className="h-3 w-3 shrink-0 text-teal xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
          <span className="leading-tight">Google synced</span>
        </div>
        <p className="text-xl font-bold text-brown xs:text-2xl sm:text-3xl">{googleSynced}</p>
      </Card>
    </div>
  );
};
