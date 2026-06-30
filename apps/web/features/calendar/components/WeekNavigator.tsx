"use client";
import type { JSX } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMondayOfWeek } from "../utils";

interface WeekNavigatorProps {
  anchor: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const WeekNavigator = ({
  anchor,
  onPrev,
  onNext,
  onToday,
}: WeekNavigatorProps): JSX.Element => {
  const first = getMondayOfWeek(anchor);
  const last = new Date(first);
  last.setDate(first.getDate() + 6);
  const year = last.getFullYear();
  const sameMonth = first.getMonth() === last.getMonth();
  const label = sameMonth
    ? `${first.toLocaleDateString("en-US", { month: "short" })} ${first.getDate()} – ${last.getDate()}, ${year}`
    : `${first.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${last.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${year}`;

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={onPrev} aria-label="Previous week">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium text-brown min-w-[160px] text-center">{label}</span>
      <Button variant="ghost" size="icon" onClick={onNext} aria-label="Next week">
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onToday}>
        Today
      </Button>
    </div>
  );
};

export default WeekNavigator;
