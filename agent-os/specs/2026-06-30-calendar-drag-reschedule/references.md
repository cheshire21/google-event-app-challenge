# References for Calendar Drag Reschedule

## DayColumn.tsx — Click-to-book pixel math

- **Location:** `apps/web/features/calendar/components/DayColumn.tsx` lines 31–39
- **Pattern:** `getBoundingClientRect()` on the column div, then `(y / rect.height) × CALENDAR_TOTAL_HOURS` to get the clicked hour — same math applies to drag position

## utils.ts — Positioning helpers

- **Location:** `apps/web/features/calendar/utils.ts`
- **Pattern:** `getTopPercent(time)` and `getHeightPercent(start, end)` convert dates to CSS percentage positions — reuse these to render the dragged block at its new position during drag

## useUpdateBooking — Existing mutation hook

- **Location:** `apps/web/features/bookings/hooks/useUpdateBooking.ts`
- **Pattern:** Accepts `{ id, startTime, endTime, ... }`, already invalidates `['bookings']` and `['feed']` on success — call this on drag end
