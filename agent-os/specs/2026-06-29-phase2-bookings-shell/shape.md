# Phase 2 — Bookings CRUD + App Shell

## Scope

Two foundational Phase 2 tickets that unblock all downstream booking UI:
- **BE-2.1 (GOO-12):** Bookings CRUD — NestJS module with full CRUD scoped to authenticated user
- **FE-2.1 (GOO-14):** Responsive app shell — sidebar (desktop) + TopBar/BottomNav/FAB (mobile)

GOO-15 (dashboard page content) ships in a separate spec.

## Decisions

- Booking ownership enforced in service layer: `findOne(id, userId)` throws 404 (not 403) for wrong owner — avoids leaking existence
- `description` is optional on bookings; `userId` is never exposed in response DTOs
- App shell breakpoint: 768px (`md:` Tailwind prefix)
- Active nav state driven by `usePathname()` — no extra state needed
- `useCurrentUser()` in the sidebar uses React Query; on loading/error shows initials placeholder so the shell never blocks render
- FAB links to `/bookings/new` (wired up in GOO-16)

## Context

- **Visuals:** `Nook Design/screenshots/desktop/02-dashboard.png`, `Nook Design/screenshots/mobile/03-dashboard.png`
- **References:** `apps/api/src/users/`, `apps/api/src/test/factories/user.factory.ts`, `apps/web/features/auth/`
- **Product alignment:** Shell must support Dashboard, Calendar, Connect Google nav items — all three Phase 2/3 routes

## Standards Applied

- `backend/nestjs-modules` — feature module layout, DTO patterns
- `backend/error-handling` — GlobalExceptionFilter, NotFoundException
- `frontend/component-architecture` — layout components in `components/layout/`, user data in `features/users/`
- `frontend/tailwind-tokens` — `bg-coral`, `text-brown`, `font-quicksand`
