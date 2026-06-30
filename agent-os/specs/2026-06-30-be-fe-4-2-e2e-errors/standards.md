# Standards for BE-4.2 + FE-4.2

## backend/testing

- E2E tests boot `AppModule` with the same global config as `main.ts` (prefix, ValidationPipe, filters)
- Use `beforeAll` / `afterAll` — boot once per suite, not once per test
- Clean up all test data in `afterAll` to leave the database in original state
- Use relative imports in `test/` files — `jest-e2e.json` has no `moduleNameMapper`

## frontend/component-architecture

- Each component lives in its own folder with `ComponentName.tsx` and `index.ts`
- `ErrorBoundary` belongs in `components/ErrorBoundary/` (app-wide, not feature-specific)

## frontend/error-handling

- All mutation hooks must have an `onError` callback that fires a `toast.error()`
- The 401 interceptor must toast before redirecting — user must see why they were logged out
- `ErrorBoundary` is a class component with `getDerivedStateFromError` + `componentDidCatch`
- Use Nook color tokens in fallback UI (`text-brown`, `text-coral`) — never hex
