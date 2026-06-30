# FE-3.2 + BE-3.2 — Google Conflict Detection + Connect Settings Page

## Scope

BE-3.2 extends `AvailabilityService.checkAvailability` (currently bookings-only) to also query `GoogleCalendarService.getEvents` when the user has connected their Google Calendar, merging conflicts from both sources. FE-3.2 builds the `/connect` page (Google Calendar settings) with connected/disconnected states, OAuth redirect flow, success/error toasts after callback, and makes the Sidebar "On" badge conditional on `user.hasGoogleCalendar`.

## Decisions

- **Route `/connect`** — Sidebar and BottomNav already link to `/connect`; page created at `app/(dashboard)/connect/page.tsx`
- **`features/users/types.ts` extended** — Adding `hasGoogleCalendar: boolean` to `User` is the minimal change that powers Sidebar badge + `GoogleCalendarCard` without new hooks; Sidebar already calls `useCurrentUser` from `features/users/`
- **Graceful Google fallback** — If `getEvents` throws during availability check, log and return booking-only conflicts; don't break the booking flow
- **Redirect updated** — `handleCallback` redirect changed from `/calendar?connected=true` → `/connect?connected=true` so settings page receives the toast trigger
- **`ConflictWarning` branch** — Adds "in your Google Calendar" copy for `type: 'google'`; `type: 'booking'` keeps existing copy
- **New feature slice `features/google-calendar/`** — `api.ts`, `hooks/useDisconnectCalendar.ts`, `components/GoogleCalendarCard.tsx`
- **New feature slice `features/settings/`** — `components/SettingsPage.tsx` (handles URL params, renders card)

## Context

- **Visuals:** `Nook Design/screenshots/desktop/09-connect.png` (connected), `10-connect-disconnected.png` (disconnected), `Nook Design/screenshots/mobile/06-connect.png`
- **References:** `AvailabilityService` (bookings-only today), `GoogleCalendarService.getEvents` (ready to call), `features/users/hooks/useCurrentUser` (Sidebar already uses it)
- **Product alignment:** Phase 3 Google Calendar integration — conflict checking and calendar visibility

## Standards Applied

- `backend/nestjs-modules` — module layout, DTO validation, Swagger
- `backend/error-handling` — graceful fallback when Google fetch fails
- `database/prisma` — no schema change needed (fields added in BE-3.1)
- `testing/unit-tests` — Prisma + GoogleCalendarService mocks, AbstractFactory
- `frontend/component-architecture` — feature-based, `"use client"` at leaves
- `frontend/tailwind-tokens` — teal/coral/brown/cream tokens only
- `frontend/testing` — Vitest + RTL, QueryClientProvider wrapper
