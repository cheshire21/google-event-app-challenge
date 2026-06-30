# FE-2.3 New Booking Form — Shaping Notes

## Scope

New-booking form at `/bookings/new` with:
- Booking name text input
- Horizontal day picker (Mon-Sun of current week)
- Start/end time inputs (browser `<input type="time">`)
- Real-time availability check: 300ms debounce → `GET /api/bookings/availability`
- `ConflictWarning` (coral) when slot is taken
- `AvailableConfirmation` (teal) when slot is free
- Submit disabled during check or when conflict exists
- On success: invalidate `['bookings']` query + navigate to `/`

## Decisions

- Page lives at `app/(dashboard)/bookings/new/page.tsx` — standard route in the dashboard group (AppShell wraps it), not an intercepting route/modal
- `BookingForm` accepts `initialValues` + `excludeId` props so FE-2.4 (edit) can reuse it
- 300ms debounce via shared `hooks/useDebounce.ts` applied to derived ISO strings in `BookingForm`
- Day picker defaults to today; submit constructs ISO datetime by combining selected date + time strings

## Context

- **Visuals:** `desktop/05-new-booking-conflict.png`, `desktop/06-new-booking-free.png`, `mobile/05-new-booking.png`
- **References:** `BookingCard.tsx` (formatTime), `useBookings.ts` (query pattern), `useIntersectionObserver.ts` (shared hook shape)
- **Product alignment:** Phase 2 — Bookings Core. FAB already links to `/bookings/new`.

## Standards Applied

- `frontend/component-architecture` — feature-based structure; thin page; `"use client"` pushed to leaves
- `frontend/tailwind-tokens` — `bg-coral/10`, `text-teal`, no hardcoded hex
- `frontend/testing` — Vitest + RTL + `QueryClientProvider` wrapper, colocated spec files
