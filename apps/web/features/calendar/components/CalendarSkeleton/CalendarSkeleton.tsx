import type { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const CalendarSkeleton = (): JSX.Element => (
  <div className="flex min-w-[600px]">
    <div className="w-16 shrink-0" />
    <div className="flex flex-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex-1 flex flex-col min-w-[80px]">
          <Skeleton className="h-8 mb-0.5 rounded bg-brown/10" />
          <Skeleton className="flex-1 rounded bg-brown/10 min-h-[400px]" />
        </div>
      ))}
    </div>
  </div>
);
