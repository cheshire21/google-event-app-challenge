"use client";

import { useEffect, type JSX, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth: boolean;
}

export const AuthGuard = ({ children, requireAuth }: AuthGuardProps): JSX.Element | null => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (requireAuth && !isAuthenticated) {
      router.replace("/login");
    } else if (!requireAuth && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);

  if (isLoading) return null;
  if (requireAuth && !isAuthenticated) return null;
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
};
