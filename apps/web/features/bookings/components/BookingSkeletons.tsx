import type { JSX } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const BookingCardSkeleton = (): JSX.Element => (
  <Skeleton className="h-[90px] w-full rounded-xl bg-brown/10" />
);

export const BookingListSkeleton = (): JSX.Element => (
  <div className="flex flex-col gap-3">
    <BookingCardSkeleton />
    <BookingCardSkeleton />
    <BookingCardSkeleton />
    <BookingCardSkeleton />
  </div>
);
