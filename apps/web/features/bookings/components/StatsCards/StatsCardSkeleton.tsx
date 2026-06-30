import type { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const StatsCardSkeleton = (): JSX.Element => (
  <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-4">
    {[0, 1, 2].map((i) => (
      <Skeleton key={i} className="h-[72px] xs:h-[82px] sm:h-[100px] rounded-xl bg-brown/10" />
    ))}
  </div>
);
