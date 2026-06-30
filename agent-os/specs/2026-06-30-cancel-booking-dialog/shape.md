# FE-2.5 Cancel Booking Dialog — Shaping Notes

## Scope

Wire the Cancel button on `BookingCard` to a confirmation dialog before deleting. Currently the button calls `onCancel(id)` which is a no-op stub in `BookingsList`. The backend `DELETE /bookings/:id` is already fully implemented.

## Decisions

- **Self-contained dialog** — `CancelConfirmDialog` owns `open` state and calls `useDeleteBooking` directly; consistent with `NewBookingDialog` / `EditBookingDialog` pattern
- **`onCancel` prop removed** — `BookingCard` no longer delegates to parent; delete is handled internally via dialog + mutation
- **Button copy from design** — "Keep it" / "Cancel booking" (design wins over dev plan copy "Keep Booking" / "Yes, cancel it")
- **`BookingCardSkeleton` stays inline** — already exists in `BookingsList`; no extraction needed
- **No new page route** — entirely modal

## Context

- **Visuals:** `Nook Design/screenshots/desktop/08-cancel-confirm.png`
- **References:** `NewBookingDialog.tsx`, `EditBookingDialog.tsx`, `useUpdateBooking.ts`
- **Product alignment:** Phase 2 — Bookings Core; cancel is guarded by confirmation to prevent accidental deletion

## Standards Applied

- `frontend/component-architecture` — feature-based, `"use client"` pushed to leaves
- `frontend/tailwind-tokens` — `bg-coral/10`, `text-coral`, `text-brown`, `bg-cream/40`
- `frontend/testing` — Vitest + RTL, `QueryClientProvider` wrapper, colocated spec files
