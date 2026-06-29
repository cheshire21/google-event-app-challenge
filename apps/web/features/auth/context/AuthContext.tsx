"use client";

import { createContext, useMemo, useSyncExternalStore, type JSX, type ReactNode } from "react";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const subscribe = (cb: () => void): (() => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

const getSnapshot = (): string | null => localStorage.getItem("access_token");

const getServerSnapshot = (): null => null;

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => ({ token, isAuthenticated: token !== null }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
