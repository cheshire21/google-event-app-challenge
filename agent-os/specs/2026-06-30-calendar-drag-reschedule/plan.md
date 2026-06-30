# Plan: Drag-and-Drop Booking Reschedule on WeekCalendar

See shape.md, standards.md, references.md for full context.

## Task 1: Save Spec Documentation ✅

Saved to `agent-os/specs/2026-06-30-calendar-drag-reschedule/`.

## Task 2: FE-5.1 — Drag-and-Drop Booking Reschedule

**Pipeline:** PM (create + assign) → nextjs-engineer → QA → PM (Done)

### Ticket

Title: `FE-5.1 — Drag-and-drop booking reschedule on calendar`

Done when:
- Booking events show cursor-grab on hover; cursor-grabbing while dragging
- Dragging moves the block visually in real-time as the mouse moves
- Duration is preserved; only start/end time shifts
- Time snaps to nearest 15-minute increment
- On drop, PATCH /api/bookings/:id is called with new startTime + endTime
- If the response is 409 (conflict), toast.error fires and block reverts to original position
- Google Calendar events (type="google") are NOT draggable
- pnpm --filter=web lint passes
- pnpm --filter=web build passes

### Files

| File | Change |
|---|---|
| `apps/web/features/calendar/utils.ts` | Add `snapTo15Min(minutes)` and `pixelToMinutes(yPx, columnHeightPx)` |
| `apps/web/features/calendar/components/CalendarEventBlock.tsx` | `onPointerDown` + `isDragging` props; cursor + opacity feedback |
| `apps/web/features/calendar/components/DayColumn.tsx` | `dragState` + drag callbacks props; override dragged event position |
| `apps/web/features/calendar/components/WeekCalendar.tsx` | Own DragState; handleDragStart/Move/End; wire useUpdateBooking |
