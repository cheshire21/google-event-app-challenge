"use client";

import { useEffect } from "react";
import type { JSX } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { GoogleCalendarCard } from "@/features/google-calendar/components/GoogleCalendarCard";

export const SettingsPage = (): JSX.Element => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("connected") === "true") {
      toast.success("Google Calendar connected successfully!");
    }
    if (searchParams.get("error") === "google_auth_failed") {
      toast.error("Failed to connect Google Calendar. Please try again.");
    }
  }, [searchParams]);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-quicksand font-bold text-2xl text-brown mb-1">Google Calendar</h1>
      <p className="text-brown/60 text-sm mb-6">
        Connect your calendar so Nook can check for conflicts before confirming any booking.
      </p>
      <GoogleCalendarCard />
    </div>
  );
};
