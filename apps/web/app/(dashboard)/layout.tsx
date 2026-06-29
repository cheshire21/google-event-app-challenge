import type { JSX, ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

const DashboardLayout = ({ children }: { children: ReactNode }): JSX.Element => (
  <AuthGuard requireAuth>
    <AppShell>{children}</AppShell>
  </AuthGuard>
);

export default DashboardLayout;
