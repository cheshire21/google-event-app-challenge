"use client";

import { useEffect, type JSX } from "react";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { RefreshCw } from "lucide-react";
import { exchangeToken } from "@/features/auth/api";

const CallbackPage = (): JSX.Element => {
  const { isLoading, error, getAccessTokenSilently } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      router.replace("/login");
      return;
    }

    getAccessTokenSilently()
      .then((token) => exchangeToken(token))
      .then(({ accessToken }) => {
        localStorage.setItem("access_token", accessToken);
        router.replace("/dashboard");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [isLoading, error, getAccessTokenSilently, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-coral" />
        <p className="text-sm text-brown/75">Signing you in…</p>
      </div>
    </div>
  );
};

export default CallbackPage;
