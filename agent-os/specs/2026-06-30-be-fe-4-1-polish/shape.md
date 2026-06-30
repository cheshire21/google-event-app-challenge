# BE-4.1 + FE-4.1 — Shaping Notes

## Scope

Phase 4 polish:

**BE-4.1** — Dedicated `PrismaExceptionFilter` that maps Prisma error codes to clean HTTP responses (P2025 → 404, P2002 → 409, others → 500 with generic message). Update Swagger title/description. Most Swagger annotations across controllers and DTOs were already complete.

**FE-4.1** — Loading skeletons for StatsCards (3 pulsing cards) and WeekCalendar (7-column grid outline). Wire `isLoading` from existing hooks — `useCalendarEvents` already returns it; `useBookingStats` needs it added.

## Decisions

- `PrismaExceptionFilter` registered before `GlobalExceptionFilter` in `main.ts` (NestJS applies filters in order; more specific first)
- `StatsCardSkeleton` co-located in `StatsCards/` folder (per component-per-folder pattern)
- `CalendarSkeleton` gets its own `CalendarSkeleton/` folder under `features/calendar/components/`
- Skeleton color: `bg-brown/10` — matches existing `BookingSkeletons.tsx` pattern, visible on cream background
- No new packages needed for either task

## Context

- **Visuals:** None — skeletons match existing card/grid dimensions
- **References:** `BookingsList/BookingSkeletons.tsx`, `useCalendarEvents.ts` (already returns `isLoading`)
- **Product alignment:** Phase 4 Polish & Quality — no layout shift, no Prisma internals leaking to clients
