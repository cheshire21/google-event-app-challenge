# Calendar Drag Reschedule — Shaping Notes

## Scope

Add mouse drag-to-reschedule for booking events on the WeekCalendar. The user grabs a booking block and drags it up or down to change its start and end time. Duration is preserved. Time snaps to 15-minute increments. On drop, the backend is called; conflicts revert the drag with a toast error.

## Decisions

- **No DnD library** — custom pointer events (`onPointerDown`/`onPointerMove`/`onPointerUp`) are sufficient given the simple grid geometry
- **Drag state owned by WeekCalendar** — it already owns week navigation and dialog state; drag state fits there
- **Same-day drag only** — v1 scope; changing the day is done via edit dialog
- **15-minute snap** — matches how bookings are typically created
- **Grab offset** — record where within the block the user grabbed so the block doesn't jump to its top edge on drag start
- **Revert on conflict** — if PATCH returns 409, the block animates back to original position and shows a toast

## Context

- **Visuals:** None — Google Calendar style behavior
- **References:** `DayColumn.tsx` click-to-book handler (same pixel-to-time math); `useUpdateBooking` hook (already exists)
- **Product alignment:** Feature was already promised to users in the UI ("drag to reschedule" text on line 85 of WeekCalendar.tsx)

## Standards Applied

- frontend/component-architecture — features/ folder structure, "use client" directive, `cn()` for class merging
- frontend/tailwind-tokens — use `cursor-grab`/`cursor-grabbing`, `opacity-60`; no arbitrary hex values
