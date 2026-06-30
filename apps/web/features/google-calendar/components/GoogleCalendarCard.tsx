"use client";

import type { JSX } from "react";
import { CalendarDays, CheckCircle2, Link2Off } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { getGoogleAuthUrl } from "../api";
import { useDisconnectCalendar } from "../hooks/useDisconnectCalendar";

const GoogleIcon = (): JSX.Element => (
  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[11px] font-bold text-white leading-none">
    G
  </span>
);

const ConnectedState = ({ email }: { email: string }): JSX.Element => {
  const { mutate: disconnect, isPending } = useDisconnectCalendar();

  const handleDisconnect = (): void => {
    disconnect();
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal/15">
            <CalendarDays className="h-5 w-5 text-teal" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-brown">{email}</span>
              <span className="flex items-center gap-1 rounded-full bg-teal/15 px-2 py-0.5 text-xs font-semibold text-teal">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          disabled={isPending}
          className="flex-shrink-0 text-brown/70 border-border hover:text-brown"
        >
          Disconnect
        </Button>
      </div>

      {/* Feature rows */}
      <div className="pt-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-brown">Conflict checking is active</p>
            <p className="text-xs text-brown/60">
              New bookings are checked against your Google events automatically.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-brown">Two-way visibility</p>
            <p className="text-xs text-brown/60">
              Your Google events appear in the week view so you can plan around them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DisconnectedState = (): JSX.Element => {
  const handleConnect = (): void => {
    getGoogleAuthUrl().then((url) => {
      window.location.href = url;
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-8 flex flex-col items-center text-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brown/5">
        <Link2Off className="h-8 w-8 text-brown/30" />
      </div>
      <div>
        <p className="font-quicksand font-bold text-lg text-brown mb-1">Calendar not connected</p>
        <p className="text-sm text-brown/60 max-w-sm">
          Without a connected calendar, Nook can only check conflicts against bookings made here —
          it won&apos;t see your Google events.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={handleConnect}
        className="flex w-full max-w-xs items-center justify-center gap-2 border-border text-brown/70 hover:text-brown"
      >
        <GoogleIcon />
        Connect Google Calendar
      </Button>
    </div>
  );
};

export const GoogleCalendarCard = (): JSX.Element => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    );
  }

  if (user?.hasGoogleCalendar) {
    return <ConnectedState email={user.email} />;
  }

  return <DisconnectedState />;
};

export default GoogleCalendarCard;
