"use client";

import type { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { CalendarDays, LayoutDashboard, Link2, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/connect", label: "Connect Google", icon: Link2 },
];

export const Sidebar = (): JSX.Element => {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const { logout } = useAuth0();

  const handleLogout = (): void => {
    logout({ logoutParams: { returnTo: window.location.origin + "/login" } });
  };

  return (
    <aside className="hidden md:flex flex-col w-60 sticky top-0 h-screen overflow-y-auto bg-cream border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral">
          <CalendarDays className="h-5 w-5 text-white" />
        </div>
        <span className="font-quicksand font-bold text-xl text-brown">Nook</span>
      </div>

      {/* New Booking CTA */}
      <div className="px-4 mb-6">
        <Link
          href="/bookings/new"
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-coral py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          + New booking
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-coral/10 text-coral"
                  : "text-brown/70 hover:bg-coral/5 hover:text-brown"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{label}</span>
              {href === "/connect" && (
                <span className="ml-auto rounded-full bg-teal/15 px-2 py-0.5 text-xs font-semibold text-teal">
                  On
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="mt-auto border-t border-border px-4 py-4 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white">
          {user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-brown">{user?.name ?? ""}</p>
          <p className="truncate text-xs text-brown/60">{user?.email ?? ""}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="flex-shrink-0 text-brown/50 transition-colors hover:text-brown"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
