import { type JSX, type ReactNode } from "react";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

const DashboardLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return <AuthGuard requireAuth>{children}</AuthGuard>;
};

export default DashboardLayout;
