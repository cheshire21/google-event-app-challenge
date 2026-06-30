"use client";

import type { JSX } from "react";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyState = (): JSX.Element => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coral/10">
      <CalendarCheck className="h-8 w-8 text-coral" />
    </div>

    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-brown">No bookings yet</h3>
      <p className="body-text max-w-xs text-muted-foreground">
        Reserve your first time slot. We&apos;ll automatically check it against
        your calendar so there are no surprises.
      </p>
    </div>

    <Button asChild>
      <Link href="/bookings/new">New booking</Link>
    </Button>
  </div>
);
