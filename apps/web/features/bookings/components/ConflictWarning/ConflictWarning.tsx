"use client";

import type { JSX } from "react";
import { AlertCircle } from "lucide-react";
import type { ConflictEntry } from "../../types";
import { formatTime } from "../../utils";

interface ConflictWarningProps {
  conflicts: ConflictEntry[];
}

export const ConflictWarning = ({ conflicts }: ConflictWarningProps): JSX.Element => (
  <div className="rounded-xl bg-coral/10 p-4">
    <div className="mb-2 flex items-center gap-2">
      <AlertCircle className="h-4 w-4 text-coral" />
      <p className="text-sm font-bold text-coral">Scheduling conflict</p>
    </div>
    {conflicts.map((conflict) => (
      <p key={conflict.id} className="text-sm text-foreground">
        Overlaps <strong>{conflict.title}</strong> (
        {formatTime(conflict.startTime)} – {formatTime(conflict.endTime)}){" "}
        {conflict.type === "google" ? "in your Google Calendar" : "in your bookings"}.
        Pick another time to continue.
      </p>
    ))}
  </div>
);

export default ConflictWarning;
