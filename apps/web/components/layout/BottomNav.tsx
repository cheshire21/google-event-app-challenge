"use client";

import type { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, Link2, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { isNavItemActive } from "./utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/connect", label: "Connect", icon: Link2 },
];

export const BottomNav = (): JSX.Element => {
  const pathname = usePathname();
  const { logout } = useLogout();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex h-16 items-center justify-around border-t border-border bg-white">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = isNavItemActive(href, pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center gap-1 text-xs font-medium ${
              isActive ? "text-coral" : "text-brown/50"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        aria-label="Log out"
        className="flex flex-col items-center gap-1 text-xs font-medium text-brown/50 hover:text-brown"
      >
        <LogOut className="h-5 w-5" />
        <span>Log out</span>
      </button>
    </nav>
  );
};

export default BottomNav;
