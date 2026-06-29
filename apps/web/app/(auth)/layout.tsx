import { type JSX, type ReactNode } from "react";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

const AuthLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
};

export default AuthLayout;
