# Phase 2 — Conflict Detection + Dashboard Page

## Scope

- **BE-2.2 (GOO-13):** `ConflictService` with overlap query + `GET /api/bookings/availability` endpoint. Also adds pagination (`PaginationQueryDto`) to the existing `GET /api/bookings` endpoint.
- **FE-2.2 (GOO-15):** Dashboard page — greeting, stats cards, infinite-scroll bookings list with empty state.

## Decisions

- Overlap condition: `startTime < endTime AND endTime > startTime` (strict inequality) — adjacent bookings are NOT conflicts
- `availability` route registered before `:id` route in the controller to prevent NestJS treating "availability" as a UUID param
- Pagination lives in `src/shared/dto/` (reusable across all list endpoints)
- `useInfiniteQuery` + intersection observer sentinel per updated skill pattern
- Google synced stat = `0` placeholder until BE-2.3 (Google Calendar sync)
- Stats derived client-side from flattened infinite query pages — no separate stats endpoint needed for Phase 2

## Context

- **Visuals:** `Nook Design/screenshots/desktop/02-dashboard.png`, `03-dashboard-empty.png`, `mobile/03-dashboard.png`
- **References:** `apps/api/src/bookings/bookings.service.ts`, `apps/web/features/users/hooks/useCurrentUser.ts`
- **Product alignment:** Conflict detection unblocks the new-booking form (GOO-16); dashboard is the first thing users see after login

## Standards Applied

- `backend/nestjs-modules` — ConflictService registered in BookingsModule, DTO patterns
- `backend/error-handling` — no new exception types needed
- `frontend/component-architecture` — `features/bookings/` for all booking UI, `hooks/` for shared sentinel
- `frontend/tailwind-tokens` — `bg-coral`, `text-brown`, `text-teal`, `font-quicksand`
