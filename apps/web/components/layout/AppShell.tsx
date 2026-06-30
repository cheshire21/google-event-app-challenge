"use client";

import type { JSX, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { FAB } from "./FAB";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps): JSX.Element => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex flex-1 flex-col">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
    <FAB />
  </div>
);

export default AppShell;
