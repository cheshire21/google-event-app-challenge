# References for BE-4.2 + FE-4.2

## Backend

### app.e2e-spec.ts (existing)
- **Location:** `apps/api/test/app.e2e-spec.ts`
- **Relevance:** Shows the supertest + NestJS testing bootstrap pattern
- **Key patterns:** `Test.createTestingModule`, `app.init()`, `request(app.getHttpServer())`

### main.ts (existing)
- **Location:** `apps/api/src/main.ts`
- **Relevance:** Global config to replicate in e2e `beforeAll` (prefix, ValidationPipe, filters)

## Frontend

### lib/api.ts (existing)
- **Location:** `apps/web/lib/api.ts`
- **Relevance:** Response interceptor for 401 — add `toast.error()` call here
- **Key patterns:** `api.interceptors.response.use()`

### providers.tsx (existing)
- **Location:** `apps/web/app/providers.tsx`
- **Relevance:** `<Toaster richColors />` already mounted — `ErrorBoundary` wraps the whole tree here

### useCreateBooking (existing)
- **Location:** `apps/web/features/bookings/hooks/useCreateBooking.ts`
- **Relevance:** Pattern for adding `onError` — all mutation hooks follow this same structure
