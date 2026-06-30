# BE-4.2 + FE-4.2 — Shaping Notes

## Scope

**BE-4.2** — E2E test suite covering auth enforcement and booking CRUD. The only existing e2e test is a stub. This adds 9 test cases against a live test database: 401 without auth, create, list, conflict (409), availability (free + occupied), update, delete, 404 after delete.

**FE-4.2** — Complete the error handling layer. `sonner` and `<Toaster>` are already wired. Missing: (1) ErrorBoundary component to catch render errors, (2) toast on 401 interceptor before redirect, (3) `onError` callbacks on all mutation hooks.

## Decisions

- E2E tests use far-future dates (2099) so test data never conflicts with real bookings
- E2E test file uses relative imports (not `@/`) — `jest-e2e.json` has no `moduleNameMapper`
- `beforeAll` / `afterAll` (not `beforeEach`) — boot app once, clean up after all tests
- `ErrorBoundary` goes in `components/ErrorBoundary/` following the per-folder pattern
- `ErrorBoundary` wraps `<Providers>` in `providers.tsx` (client boundary)
- 401 toast fires before the localStorage clear + redirect (user sees it momentarily)

## Context

- **Visuals:** None
- **References:** `apps/api/test/app.e2e-spec.ts`, `apps/api/src/main.ts`, `apps/web/lib/api.ts`, `apps/web/app/providers.tsx`
- **Product alignment:** Phase 4 Polish & Quality — no new features
