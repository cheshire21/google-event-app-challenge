# FE-2.4 Edit Booking Dialog — Shaping Notes

## Scope

Edit/reschedule flow as a modal dialog triggered from `BookingCard`. Pre-populates `BookingForm` with existing booking data and passes `excludeId` so the conflict check ignores the booking being edited. On save, closes the dialog and refreshes the list.

## Decisions

- **Modal, not page** — GOO-17 specified a page route; user confirmed modal consistent with FE-2.3
- **`BookingForm` reuse** — `initialValues`, `excludeId`, `onCancel` props were designed for this exact case
- **`submitLabel` prop** — add to `BookingForm` so edit dialog shows "Save" instead of "Confirm booking"
- **`bookingToFormValues`** utility — converts `Booking` ISO datetimes → `BookingFormValues` (date + HH:MM strings); lives in `features/bookings/utils.ts`
- **`useBooking.ts`** — created even though not needed immediately; will be used by Calendar view (FE-3.1)
- **Delete button** — shown in design but wired in FE-2.5; placeholder only in this ticket
- **Edit button on `BookingCard`** — pencil icon (`Pencil` from lucide-react), `variant="ghost" size="icon"`, placed before Cancel

## Context

- **Visuals:** `desktop/07-edit-booking.png` — "Edit booking" dialog, pre-populated, Delete / Cancel / Save buttons
- **References:** `NewBookingDialog.tsx` (same dialog wrapper pattern), `BookingForm.tsx` (reused with props)
- **Product alignment:** Phase 2 — Bookings Core

## Standards Applied

- `frontend/component-architecture` — feature-based, `"use client"` pushed to leaves, thin pages
- `frontend/tailwind-tokens` — `bg-coral/10`, `text-teal`, no hardcoded hex
- `frontend/testing` — Vitest + RTL, `QueryClientProvider` wrapper, colocated spec files
