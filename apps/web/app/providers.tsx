"use client";

import { type JSX, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";
import { getQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/features/auth/context/AuthContext";

const Providers = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? ""}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? ""}
      >
        <AuthProvider>{children}</AuthProvider>
      </Auth0Provider>
    </QueryClientProvider>
  );
};

export default Providers;
