"use client";

import { createContext, useEffect, useMemo, useState, useSyncExternalStore, type JSX, type ReactNode } from "react";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const subscribe = (cb: () => void): (() => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

const getSnapshot = (): string | null => localStorage.getItem("access_token");

const getServerSnapshot = (): null => null;

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    setMounted(true);
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated: mounted && token !== null, isLoading: !mounted }),
    [token, mounted]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
