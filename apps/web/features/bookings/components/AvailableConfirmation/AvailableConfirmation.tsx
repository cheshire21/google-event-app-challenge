"use client";

import type { JSX } from "react";
import { CheckCircle2 } from "lucide-react";

export const AvailableConfirmation = (): JSX.Element => (
  <div className="rounded-xl bg-teal/10 p-4">
    <div className="mb-1 flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-teal" />
      <p className="text-sm font-bold text-teal">This slot is free</p>
    </div>
    <p className="text-sm text-brown/75">
      No conflicts with your bookings or Google Calendar.
    </p>
  </div>
);

export default AvailableConfirmation;
