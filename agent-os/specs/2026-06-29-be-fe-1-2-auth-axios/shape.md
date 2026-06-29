# BE-1.2 + FE-1.2 — Shaping Notes

## Scope

- **BE-1.2**: Auth module with `POST /api/auth/exchange` endpoint — verifies Auth0 token via JWKS, upserts User, returns a signed app JWT. Includes `JwtStrategy`, `JwtAuthGuard`, and `@CurrentUser()` decorator.
- **FE-1.2**: `lib/api.ts` (Axios singleton with request/response interceptors) and `lib/query-client.ts` (React Query singleton). Pure infrastructure — no UI.

## Decisions

- Auth0 credentials left as placeholders in `.env` — developer fills in real values
- `jose` + `jwks-rsa` for JWKS verification (spec requirement)
- App JWT: `sub: user.id`, 30-day expiry via `@nestjs/jwt`
- Axios interceptor reads token from `localStorage` — consistent with FE-1.3 AuthContext approach
- React Query `staleTime: 60_000` — set as singleton default, can be overridden per-query
- `prisma.mock.ts` updated to uncomment `user` and `booking` entries as part of this task

## Context

- **Visuals:** `Nook Design/screenshots/desktop/01-login.png`, `mobile/01-login.png`
- **References:** `apps/api/src/shared/prisma/prisma.service.ts` (global provider pattern), `apps/api/src/test/mocks/prisma.mock.ts`
- **Product alignment:** Authentication is the gate for all other features — no bookings without a valid app JWT

## Standards Applied

- `backend/nestjs-modules` — full subfolder structure under `src/modules/auth/`, class-validator DTOs, Swagger decorators
- `testing/unit-tests` — prisma mock with `user: mockModel()`, service test wiring pattern
- `frontend/component-architecture` — files go in `lib/` (shared infra), not `features/`
