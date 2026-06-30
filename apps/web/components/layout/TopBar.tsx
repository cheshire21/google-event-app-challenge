"use client";

import type { JSX } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";

export const TopBar = (): JSX.Element => {
  const { data: user } = useCurrentUser();

  return (
    <header className="flex md:hidden h-14 items-center justify-between border-b border-border bg-white px-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral">
          <CalendarDays className="h-4 w-4 text-white" />
        </div>
        <span className="font-quicksand font-bold text-lg text-brown">Nook</span>
      </Link>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white">
        {user?.name?.[0]?.toUpperCase() ?? "?"}
      </div>
    </header>
  );
};

export default TopBar;
