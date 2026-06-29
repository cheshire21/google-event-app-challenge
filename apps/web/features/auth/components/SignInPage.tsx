"use client";

import { type JSX } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Calendar, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const GoogleIcon = (): JSX.Element => (
  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fill="#fff"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#fff"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#fff"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#fff"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  </span>
);

export const SignInPage = (): JSX.Element => {
  const { loginWithRedirect } = useAuth0();

  const handleGoogleSignIn = (): void => {
    void loginWithRedirect({ authorizationParams: { connection: "google-oauth2" } });
  };

  return (
    <div className="flex flex-col md:flex-row md:h-screen">
      {/* Left panel */}
      <div className="flex w-full flex-col gap-10 bg-cream px-8 py-10 md:w-1/2 md:px-14 md:py-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-coral">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="font-quicksand text-xl font-bold text-brown">
            Nook
          </span>
        </div>

        {/* Copy block */}
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold leading-tight text-brown">
            Booking made calm &amp; conflict-free.
          </h1>
          <p className="text-base leading-relaxed text-brown/75">
            Reserve time slots in seconds. Nook checks your existing bookings and your Google Calendar so you never double-book again.
          </p>
        </div>

        {/* Preview card */}
        <Card className="md:mt-auto gap-0 rounded-2xl p-5">
          {/* Row 1 — Design Review */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1 rounded-full bg-coral" />
              <div>
                <p className="text-sm font-semibold text-brown">
                  Design Review
                </p>
                <p className="text-xs text-gray-500">
                  10:00 – 11:00 AM
                </p>
              </div>
            </div>
            <Check className="h-5 w-5 text-teal" />
          </div>

          {/* Row 2 — Dentist */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-1 rounded-full bg-teal" />
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-brown">
                    Dentist
                  </p>
                  <span className="text-xs text-gray-400">
                    · Google
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  4:00 – 5:00 PM
                </p>
              </div>
            </div>
            <RefreshCw className="h-5 w-5 text-teal" />
          </div>
        </Card>
      </div>

      {/* Right panel */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-8 py-10 md:flex-1 md:px-12 md:py-12">
        <div className="flex w-full max-w-sm flex-col gap-6">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-brown">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to manage your time slots.
            </p>
          </div>

          {/* Google sign-in button + caption */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleGoogleSignIn}
              className="w-full rounded-2xl border-gray-200 font-semibold text-brown shadow-sm hover:bg-gray-50"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <p className="flex items-center justify-center gap-1 text-xs text-teal">
              <RefreshCw className="h-3 w-3" />
              Syncs your calendar &amp; checks conflicts automatically
            </p>
          </div>

          {/* Info box */}
          <Card className="gap-0 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              <p className="text-sm text-gray-600">
                We use your Google account so Nook can check your calendar and keep you double-booking free.
              </p>
            </div>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400">
            By continuing you agree to Nook&apos;s Terms &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
