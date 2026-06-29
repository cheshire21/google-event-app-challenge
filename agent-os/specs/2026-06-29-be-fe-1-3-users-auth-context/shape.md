# BE-1.3 + FE-1.3 — Shaping Notes

## Scope

BE-1.3: Users module exposing `GET /api/users/me` and `PATCH /api/users/me` — profile read/update behind JwtAuthGuard.

FE-1.3: Auth state machine — AuthContext (localStorage token via useSyncExternalStore), AuthGuard (redirect enforcement), providers.tsx, and the (auth)/(dashboard) route-group layouts.

## Decisions

- `AuthContext` uses `useSyncExternalStore` over `useState + useEffect` for SSR safety
- Route-group layouts are Server Components — `AuthGuard` is the only client boundary with redirect logic
- Placeholder login/dashboard pages created as redirect targets so build passes
- `UserFactory` (already in `src/test/factories/`) used in BE tests

## Context

- **Visuals:** `Nook Design/screenshots/desktop/01-login.png`, `desktop/02-dashboard.png`
- **References:** `apps/api/src/auth/` (module pattern), `apps/web/lib/api.ts` (access_token key)
- **Product alignment:** Final auth foundation ticket — Phase 2 unblocked after this

## Standards Applied

- `backend/nestjs-modules` — `src/users/` module layout
- `backend/error-handling` — `NotFoundException` in service, GlobalExceptionFilter handles shape
- `frontend/component-architecture` — `features/auth/` with context/hooks/components split
- `frontend/testing` — Vitest + RTL, mock `useAuth` + `next/navigation`
