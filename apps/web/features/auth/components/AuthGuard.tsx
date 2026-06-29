"use client";

import { useEffect, type JSX, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth: boolean;
}

export const AuthGuard = ({ children, requireAuth }: AuthGuardProps): JSX.Element | null => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.replace("/login");
    } else if (!requireAuth && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [requireAuth, isAuthenticated, router]);

  if (requireAuth && !isAuthenticated) return null;
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
};
