# Nook — Development Plan

---

## Phase 1: Foundation & Authentication

### BE Tasks

---

**BE-1.1 — Prisma: User and Booking models**

Define the two core Prisma models and run the initial migration.

**Models:**
```prisma
model User {
  id        String    @id @default(uuid())
  auth0Id   String    @unique
  email     String    @unique
  name      String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  bookings  Booking[]
}

model Booking {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  startTime DateTime
  endTime   DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Done when:** `prisma migrate dev --name init` and `prisma generate` run without error; `pnpm --filter=api build` passes.
**Tests:** None — infrastructure only.

---

**BE-1.2 — Auth module: JWT exchange endpoint + guards**

Validates Auth0 access tokens, upserts users, and issues app JWTs. All protected endpoints use the resulting `JwtAuthGuard`.

**New packages:** `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt`, `@nestjs/jwt`, `jwks-rsa`, `jose`

**New env vars:** `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` (add to `env.validation.ts`)

**Files:**
- `src/modules/auth/auth.module.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/dto/exchange-token.dto.ts` — `{ auth0AccessToken: string }`
- `src/modules/auth/strategies/jwt.strategy.ts` — PassportStrategy validating app JWTs
- `src/modules/auth/guards/jwt-auth.guard.ts`
- `src/modules/auth/decorators/current-user.decorator.ts`

**Endpoint:** `POST /api/auth/exchange`
1. Verify `auth0AccessToken` against JWKS
2. Call `/userinfo` to fetch email + name
3. Upsert `User` in DB
4. Return `{ accessToken }` — app JWT (sub: user.id, 30-day expiry)

**Done when:** Exchange endpoint returns a signed JWT; protected endpoints return 401 without a valid token; lint + build + tests pass.
**Tests (unit) — `auth.service.spec.ts`:** mock JWKS + userinfo + Prisma; assert upsert called with correct auth0Id; assert returned JWT contains `sub: user.id`.

---

**BE-1.3 — Users module: profile endpoints**

Exposes the current user's profile for the FE avatar/name display.

**Files:**
- `src/modules/users/users.module.ts`
- `src/modules/users/users.service.ts` — `findById`, `updateProfile`
- `src/modules/users/users.controller.ts`
- `src/modules/users/dto/update-user.dto.ts` — `{ name?: string }`
- `src/modules/users/entities/user.entity.ts`

**Endpoints:**
- `GET /api/users/me` — requires `JwtAuthGuard`
- `PATCH /api/users/me` — requires `JwtAuthGuard`

**Done when:** `GET /api/users/me` returns 401 without token and user profile with valid token; `PATCH` persists name change; lint + build + tests pass.
**Tests (unit) — `users.service.spec.ts`:** mock Prisma; test `findById` throws `NotFoundException` for unknown id; test `updateProfile` calls `prisma.user.update` with correct args.

---

### FE Tasks

---

**FE-1.1 — Dependencies + Tailwind design tokens + fonts**

**New packages:** `@tanstack/react-query`, `axios`, `react-hook-form`, `@hookform/resolvers`, `zod`, `@auth0/auth0-react`

**Files to modify:**
- `apps/web/app/globals.css` — add Nook CSS variables: `--color-cream: #FAF7F2`, `--color-coral: #E8694A`, `--color-teal: #38B2AC`, `--color-brown: #3D2C2C`; add utility classes `.page-heading`, `.body-text`, `.card-title`
- `apps/web/app/layout.tsx` — add `next/font/google` calls for Quicksand + Figtree; add `<link>` for Material Symbols Rounded; remove Geist fonts

**Done when:** No hardcoded hex colors in any file; lint + build pass.
**Tests:** None.

---

**FE-1.2 — Axios instance + React Query client**

**New env vars** (`apps/web/.env`): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_AUTH0_DOMAIN`, `NEXT_PUBLIC_AUTH0_CLIENT_ID`, `NEXT_PUBLIC_AUTH0_AUDIENCE`

**Files to create:**
- `apps/web/lib/api.ts` — Axios instance with `baseURL: NEXT_PUBLIC_API_URL`; request interceptor attaches `Authorization: Bearer <token>` from localStorage; response interceptor on 401 clears token + redirects to `/login`
- `apps/web/lib/query-client.ts` — singleton `QueryClient` with `staleTime: 60_000`

**Done when:** Build passes; Axios instance sends correct auth header.
**Tests (unit) — `lib/api.spec.ts`:** mock localStorage; assert interceptors.

---

**FE-1.3 — AuthContext, AuthGuard, route group layouts**

**Files to create:**
- `apps/web/features/auth/context/AuthContext.tsx` — exposes `{ token, isAuthenticated }`
- `apps/web/features/auth/hooks/useAuth.ts`
- `apps/web/features/auth/components/AuthGuard.tsx` — `"use client"`; `requireAuth: boolean`; redirects in `useEffect`, returns `null` while redirecting
- `apps/web/app/providers.tsx` — `"use client"` wrapper: `QueryClientProvider` + `Auth0Provider` + `AuthProvider`
- `apps/web/app/(auth)/layout.tsx` — wraps in `<AuthGuard requireAuth={false}>`
- `apps/web/app/(dashboard)/layout.tsx` — wraps in `<AuthGuard requireAuth>`

**Done when:** `/dashboard` without token redirects to `/login`; `/login` with token redirects to `/dashboard`; build passes.
**Tests (unit) — `AuthGuard.spec.tsx`:** cover all three states (no token + requireAuth; has token + requireAuth=false; matching state).

---

**FE-1.4 — Sign-in page + Auth0 callback handler**

**Files to create:**
- `apps/web/features/auth/api.ts` — `exchangeToken(auth0AccessToken): Promise<AuthResponse>` → `POST /api/auth/exchange`
- `apps/web/features/auth/components/SignInPage.tsx` — Nook logo, tagline, "Sign in with Google" button calling `loginWithRedirect({ connection: 'google-oauth2' })`
- `apps/web/app/(auth)/login/page.tsx`
- `apps/web/app/callback/page.tsx` — `"use client"`; on mount: `getAccessTokenSilently()` → `exchangeToken()` → `localStorage.setItem('access_token', ...)` → `router.replace('/dashboard')`; on error → `/login`

**Done when:** Sign-in button calls `loginWithRedirect`; callback page exchanges token and redirects; lint + build + tests pass.
**Tests (unit) — `SignInPage.spec.tsx`:** mock `useAuth0`; assert `loginWithRedirect` called on button click.

---

## Phase 2: Bookings Core

### BE Tasks

---

**BE-2.1 — Bookings module: CRUD endpoints**

**Files:**
- `src/modules/bookings/bookings.module.ts`
- `src/modules/bookings/bookings.service.ts`
- `src/modules/bookings/bookings.controller.ts`
- `src/modules/bookings/dto/create-booking.dto.ts` — `{ title, startTime (ISO8601), endTime (ISO8601) }`; custom validator ensures `startTime < endTime`
- `src/modules/bookings/dto/update-booking.dto.ts` — `PartialType(CreateBookingDto)`
- `src/modules/bookings/entities/booking.entity.ts`

**Endpoints (all require `JwtAuthGuard`):**
- `GET /api/bookings` — list for current user; optional `?start=&end=` filters
- `GET /api/bookings/:id` — 404 if not found or wrong owner
- `POST /api/bookings` — creates; 409 on conflict (wired to `ConflictService` from BE-2.2)
- `PATCH /api/bookings/:id` — updates; 409 on conflict
- `DELETE /api/bookings/:id` — 204 No Content

**Done when:** All endpoints reject unauthenticated requests; cross-user access returns 404; lint + build + tests pass.
**Tests (unit) — `bookings.service.spec.ts`:** mock Prisma; test `findAll` scopes to userId; test `findById` throws for wrong owner; test `create`/`update`/`remove` call correct Prisma methods.

---

**BE-2.2 — Conflict detection service + availability endpoint**

**Files to create:**
- `src/modules/bookings/conflict.service.ts` — `checkConflict(userId, startTime, endTime, excludeBookingId?)`:
  - Queries bookings where `startTime < newEnd AND endTime > newStart`
  - Returns `{ hasConflict: boolean, conflicts: Array<{ id, title, startTime, endTime, type: 'booking' }> }`

**New endpoint:**
- `GET /api/bookings/availability?start=&end=&excludeId=` — returns `AvailabilityResult`

**Done when:** Adjacent bookings (end of A = start of B) are NOT flagged; `excludeId` correctly excludes the booking being edited; lint + tests pass.
**Tests (unit) — `conflict.service.spec.ts`:** full overlap → conflict; partial overlaps → conflict; adjacent → no conflict; `excludeId` → excluded from check.

---

### FE Tasks

---

**FE-2.1 — Responsive app shell**

**Files to create:**
- `apps/web/components/layout/AppShell.tsx` — sidebar on desktop (`md:`), TopBar + BottomNav + FAB on mobile
- `apps/web/components/layout/Sidebar.tsx` — logo + nav links (Dashboard, Calendar, Settings) + user avatar
- `apps/web/components/layout/TopBar.tsx` — page title + user avatar
- `apps/web/components/layout/BottomNav.tsx` — three icon tabs; active tab in coral
- `apps/web/components/layout/FAB.tsx` — coral `+` button → `/bookings/new`
- `apps/web/features/users/api.ts` — `getMe()`
- `apps/web/features/users/hooks/useCurrentUser.ts` — `useQuery(['me'], getMe)`

**Done when:** Sidebar visible at ≥ 760px; mobile nav visible at < 760px; lint + build pass.
**Tests:** None — verified by build + visual inspection.

---

**FE-2.2 — Dashboard page: stats cards + bookings list**

**Files to create:**
- `apps/web/features/bookings/types.ts` — `Booking`, `ConflictEntry`, `AvailabilityResult`, `CreateBookingPayload`, `UpdateBookingPayload`
- `apps/web/features/bookings/api.ts` — `getBookings`, `getBookingById`, `createBooking`, `updateBooking`, `deleteBooking`, `checkAvailability`
- `apps/web/features/bookings/hooks/useBookings.ts`
- `apps/web/features/bookings/hooks/useBookingStats.ts` — derives `{ total, upcoming, today }` from `Booking[]`
- `apps/web/features/bookings/components/StatsCards.tsx` — three cards: Total, Upcoming, Today
- `apps/web/features/bookings/components/BookingsList.tsx` — renders cards; skeletons while loading; EmptyState when empty
- `apps/web/features/bookings/components/BookingCard.tsx` — title, date, time range; Edit + Cancel icon buttons
- `apps/web/features/bookings/components/EmptyState.tsx` — "No bookings yet" + "New Booking" CTA
- `apps/web/features/bookings/components/DashboardPage.tsx`
- `apps/web/app/(dashboard)/dashboard/page.tsx`

**Done when:** Stats cards show correct counts; empty state renders when list is empty; lint + build + tests pass.
**Tests (Vitest + RTL):** `StatsCards.spec.tsx` — correct numbers from prop; `EmptyState.spec.tsx` — heading + CTA; `BookingCard.spec.tsx` — title, date, edit href.

---

**FE-2.3 — New booking form with real-time conflict check**

**Files to create:**
- `apps/web/features/bookings/schemas/booking.schema.ts` — Zod schema for `{ title, date, startTime, endTime }`; `endTime` must be after `startTime`
- `apps/web/features/bookings/hooks/useCheckAvailability.ts` — `useQuery` enabled only when both times are defined; 300ms debounce
- `apps/web/features/bookings/hooks/useCreateBooking.ts` — `useMutation`; on success invalidates `['bookings']` + navigates to `/dashboard`
- `apps/web/features/bookings/components/ConflictWarning.tsx` — coral warning box listing conflict titles + times
- `apps/web/features/bookings/components/AvailableConfirmation.tsx` — teal "Slot is available" strip
- `apps/web/features/bookings/components/BookingForm.tsx` — `"use client"`; React Hook Form + Zod; derives ISO start/end; renders ConflictWarning or AvailableConfirmation; submit disabled while check in-flight or conflict present; accepts `initialValues` + `onSubmit` props for reuse in edit mode
- `apps/web/app/(dashboard)/bookings/new/page.tsx`

**Done when:** All four fields required; Zod errors surface inline; availability check fires on time change; submit blocked on conflict; lint + build + tests pass.
**Tests (Vitest + RTL):** `BookingForm.spec.tsx` — all states (conflict, available, loading); `ConflictWarning.spec.tsx`; `AvailableConfirmation.spec.tsx`.

---

**FE-2.4 — Edit / reschedule booking form**

**Files to create:**
- `apps/web/features/bookings/hooks/useBooking.ts` — `useQuery(['booking', id], getBookingById)`
- `apps/web/features/bookings/hooks/useUpdateBooking.ts` — `useMutation`; on success invalidates `['bookings']` + `['booking', id]` + navigates to `/dashboard`
- `apps/web/features/bookings/components/EditBookingPage.tsx` — fetches booking; shows skeleton while loading; renders `BookingForm` with `initialValues` and `excludeId`
- `apps/web/app/(dashboard)/bookings/[id]/edit/page.tsx`

**Done when:** Form fields pre-populated; conflict re-checked excluding own booking; successful save navigates to dashboard; lint + build + tests pass.
**Tests (Vitest + RTL):** `EditBookingPage.spec.tsx` — pre-fill assertion; mutation called on submit.

---

**FE-2.5 — Cancel booking confirmation dialog**

**Files to create:**
- `apps/web/features/bookings/hooks/useDeleteBooking.ts` — `useMutation`; on success invalidates `['bookings']`
- `apps/web/features/bookings/components/CancelConfirmDialog.tsx` — modal dialog; shows booking title; "Keep Booking" → `onClose`; "Yes, cancel it" → `onConfirm`
- `apps/web/features/bookings/components/BookingCardSkeleton.tsx`

**Files to modify:**
- `BookingCard.tsx` — wire cancel button to local `isDialogOpen` state; render dialog; connect `useDeleteBooking`
- `BookingsList.tsx` — render 3 skeletons while `isPending`

**Done when:** Cancel opens dialog; "Keep Booking" closes without API call; confirm calls DELETE and removes card; lint + build + tests pass.
**Tests (Vitest + RTL):** `CancelConfirmDialog.spec.tsx` — "Keep Booking" calls `onClose`; confirm calls `onConfirm`; `BookingCard.spec.tsx` — dialog appears on cancel click; mutation called on confirm.

---

## Phase 3: Google Calendar Integration

### BE Tasks

---

**BE-3.1 — Google Calendar module: OAuth flow + token storage**

**New packages:** `googleapis`

**New env vars:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `FRONTEND_URL`

**Prisma migration** — add to `User`:
```prisma
googleAccessToken  String?
googleRefreshToken String?
googleTokenExpiry  DateTime?
hasGoogleCalendar  Boolean  @default(false)
```

**Files:**
- `src/modules/google-calendar/google-calendar.module.ts`
- `src/modules/google-calendar/google-calendar.service.ts`:
  - `generateAuthUrl(userId)` — creates OAuth2 URL with `calendar.readonly` scope; embeds signed state JWT (10-min expiry)
  - `handleCallback(code, state)` — validates state JWT, exchanges code for tokens, stores on User, sets `hasGoogleCalendar: true`
  - `getEvents(userId, startTime, endTime)` — loads tokens, auto-refreshes if expired, calls `calendar.events.list`, returns `CalendarEventDto[]`
  - `disconnectCalendar(userId)` — clears all token fields + sets `hasGoogleCalendar: false`
- `src/modules/google-calendar/google-calendar.controller.ts`:
  - `GET /api/google/auth-url` — returns `{ url }`
  - `GET /api/google/callback?code=&state=` — no auth guard; on success redirects to `FRONTEND_URL/settings?connected=true`
  - `DELETE /api/google/disconnect` — 204
  - `GET /api/google/events?start=&end=` — returns `CalendarEventDto[]`
- `src/modules/google-calendar/dto/calendar-event.dto.ts` — `{ id, title, startTime, endTime, type: 'google' }`

**Done when:** Auth URL contains state; after OAuth flow `hasGoogleCalendar: true`; events endpoint returns calendar data; disconnect clears tokens; lint + build + tests pass.
**Tests (unit) — `google-calendar.service.spec.ts`:** auth URL has correct scopes; callback stores tokens; `getEvents` maps to `CalendarEventDto`; no tokens → `BadRequestException`; disconnect clears fields.

---

**BE-3.2 — Conflict detection: extend to Google Calendar**

**Files to modify:**
- `src/modules/bookings/bookings.module.ts` — import `GoogleCalendarModule`
- `src/modules/bookings/conflict.service.ts` — inject `GoogleCalendarService`; if `hasGoogleCalendar`, merge Google events into conflict results with `type: 'google'`

**Done when:** User without Google → only DB checked; user with Google → both sources merged; lint + tests pass.
**Tests (unit):** update `conflict.service.spec.ts` — no Google → `getEvents` never called; Google free → no conflict; Google conflict → `type: 'google'` entry; both conflict → both entries returned.

---

### FE Tasks

---

**FE-3.1 — Week calendar view**

**Files to create:**
- `apps/web/features/calendar/types.ts` — `CalendarEvent { id, title, startTime: Date, endTime: Date, type: 'booking' | 'google' }`
- `apps/web/features/calendar/utils.ts` — `getWeekDays(anchor)`, `bookingToCalendarEvent`, `googleEventToCalendarEvent`, `getTopPercent`, `getHeightPercent`
- `apps/web/features/calendar/api.ts` — `getGoogleCalendarEvents(start, end)`
- `apps/web/features/calendar/hooks/useCalendarEvents.ts` — parallel queries for bookings + Google events (conditional on `hasGoogleCalendar`); merges and returns `CalendarEvent[]`
- `apps/web/features/calendar/components/WeekNavigator.tsx` — Prev/Next week buttons + "Week of [date]" label
- `apps/web/features/calendar/components/CalendarEvent.tsx` — absolutely positioned block; coral for `booking`, teal for `google`; `booking` events navigate to edit on click
- `apps/web/features/calendar/components/DayColumn.tsx` — 24 hour-row lines + positioned events
- `apps/web/features/calendar/components/WeekCalendar.tsx` — manages `currentWeekStart` state; renders navigator + 7 day columns
- `apps/web/app/(dashboard)/calendar/page.tsx`

**Done when:** Correct Mon–Sun columns; prev/next week navigation works; booking blocks are coral and clickable; Google blocks are teal and read-only; lint + build + tests pass.
**Tests (Vitest):** `getWeekDays.spec.ts`; `getTopPercent.spec.ts`; `getHeightPercent.spec.ts`; `WeekNavigator.spec.tsx`; `CalendarEvent.spec.tsx`.

---

**FE-3.2 — Settings page: Google Calendar connect/disconnect**

**Files to create:**
- `apps/web/features/google-calendar/api.ts` — `getGoogleAuthUrl()`, `disconnectGoogleCalendar()`
- `apps/web/features/google-calendar/hooks/useDisconnectCalendar.ts` — `useMutation`; on success invalidates `['me']`
- `apps/web/features/google-calendar/components/GoogleCalendarCard.tsx` — `"use client"`; reads `hasGoogleCalendar` from `useCurrentUser()`; renders connected or disconnected state
- `apps/web/features/settings/components/SettingsPage.tsx` — renders `GoogleCalendarCard`; on mount checks `?connected=true` → success toast; `?error=google_auth_failed` → error toast
- `apps/web/app/(dashboard)/settings/page.tsx`

**Done when:** Disconnected state shows "Connect" button; clicking connects via Google OAuth redirect; settings page shows success toast after callback; "Disconnect" clears connection; lint + build + tests pass.
**Tests (Vitest + RTL):** `GoogleCalendarCard.spec.tsx` — both states; `SettingsPage.spec.tsx` — `?connected=true` triggers success toast.

---

## Phase 4: Polish & Quality

### BE Tasks

---

**BE-4.1 — Swagger documentation + Prisma exception filter**

**Files to create:**
- `src/shared/filters/prisma-exception.filter.ts` — maps `P2025` → 404; `P2002` → 409; others → 500 with generic message

**Files to modify:**
- `src/main.ts` — register global `PrismaExceptionFilter`; update Swagger title/description; add tags for auth, users, bookings, google-calendar
- All DTOs + entities — add `@ApiProperty` decorators
- All controllers — add `@ApiResponse`, `@ApiBearerAuth`, `@ApiOperation`

**Done when:** `/docs` shows all four tag groups with auth toggle; Prisma errors don't leak; lint + build pass.
**Tests (unit) — `prisma-exception.filter.spec.ts`:** P2025 → 404; P2002 → 409; unknown → 500 with generic message.

---

**BE-4.2 — E2E test suite: auth + booking CRUD**

**Files to create:**
- `apps/api/test/bookings.e2e-spec.ts`:
  - `beforeAll` — create test user in DB; sign app JWT
  - `POST /api/bookings` valid → 201
  - `GET /api/bookings` → array with created booking
  - `POST /api/bookings` overlapping → 409
  - `GET /api/bookings/availability` free slot → `{ hasConflict: false }`
  - `GET /api/bookings/availability` overlapping slot → `{ hasConflict: true }`
  - `PATCH /api/bookings/:id` → 200 updated title
  - `DELETE /api/bookings/:id` → 204
  - `GET /api/bookings/:id` after delete → 404
  - All without auth header → 401

**Done when:** `pnpm --filter=api test:e2e` passes against a clean test database.

---

### FE Tasks

---

**FE-4.1 — Loading skeletons + empty states**

**Files to create:**
- `apps/web/features/bookings/components/StatsCardSkeleton.tsx` — three pulsing card placeholders
- `apps/web/features/calendar/components/CalendarSkeleton.tsx` — 7 grey column outlines

**Files to modify:**
- `StatsCards.tsx` — render skeleton while `isPending`
- `WeekCalendar.tsx` — render `CalendarSkeleton` while `isPending`

**Done when:** No layout shift between skeleton and real content; lint + build pass.

---

**FE-4.2 — Error handling: toasts + error boundaries**

**New packages:** `sonner`

**Files to create:**
- `apps/web/components/ErrorBoundary.tsx` — catches render errors; shows "Something went wrong" + "Try again" button

**Files to modify:**
- `app/providers.tsx` — add `<Toaster position="top-right" />` from `sonner`
- `app/layout.tsx` — wrap `<Providers>` in `<ErrorBoundary>`
- `lib/api.ts` — 401 response interceptor: `toast.error('Session expired...')` before redirect
- All mutation hooks — add `onError: () => toast.error('...')` callbacks

**Done when:** Failed mutations show toast; render errors show `ErrorBoundary` fallback; lint + build pass.
**Tests:** `ErrorBoundary.spec.tsx` — throw inside child, assert fallback heading renders.

---

**FE-4.3 — Responsive polish + accessibility pass**

**Files to audit + fix:**
- `BottomNav.tsx` — `aria-label` on each tab; `aria-current="page"` on active tab
- `FAB.tsx` — `aria-label="New booking"`
- `WeekNavigator.tsx` — `aria-label` on prev/next buttons
- `BookingCard.tsx` — `aria-label="Edit <title>"` and `aria-label="Cancel <title>"` on icon buttons
- `CalendarEvent.tsx` — `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space triggers navigation) on booking events
- All pages — verify no horizontal overflow at 375px
- `app/layout.tsx` — confirm `<html lang="en">` and correct `<title>` metadata

**Done when:** No icon-only element missing `aria-label`; no horizontal overflow at 375px; keyboard navigation works on calendar; lint + build + tests pass.
**Tests:** `BottomNav.spec.tsx` — each link has non-empty `aria-label`; active link has `aria-current="page"`.

---

## Summary

| ID | Track | Phase | Task |
|---|---|---|---|
| BE-1.1 | BE | 1 | Prisma User + Booking models |
| BE-1.2 | BE | 1 | Auth module: exchange endpoint + JWT guard |
| BE-1.3 | BE | 1 | Users module: profile endpoints |
| FE-1.1 | FE | 1 | Dependencies + Tailwind design tokens + fonts |
| FE-1.2 | FE | 1 | Axios instance + React Query client |
| FE-1.3 | FE | 1 | AuthContext, AuthGuard, route group layouts |
| FE-1.4 | FE | 1 | Sign-in page + Auth0 callback handler |
| BE-2.1 | BE | 2 | Bookings module: CRUD endpoints |
| BE-2.2 | BE | 2 | Conflict detection + availability endpoint |
| FE-2.1 | FE | 2 | Responsive app shell (sidebar / mobile layout) |
| FE-2.2 | FE | 2 | Dashboard: stats cards + bookings list |
| FE-2.3 | FE | 2 | New booking form + real-time conflict check |
| FE-2.4 | FE | 2 | Edit booking form (prefill + conflict re-check) |
| FE-2.5 | FE | 2 | Cancel booking confirmation dialog |
| BE-3.1 | BE | 3 | Google Calendar module: OAuth + token storage |
| BE-3.2 | BE | 3 | Conflict detection: extend to Google Calendar |
| FE-3.1 | FE | 3 | Week calendar view |
| FE-3.2 | FE | 3 | Settings: Google Calendar connect/disconnect |
| BE-4.1 | BE | 4 | Swagger polish + Prisma exception filter |
| BE-4.2 | BE | 4 | E2E test suite |
| FE-4.1 | FE | 4 | Loading skeletons + empty states |
| FE-4.2 | FE | 4 | Error handling: toasts + error boundaries |
| FE-4.3 | FE | 4 | Responsive polish + accessibility pass |

## Dependencies

- Phase 1 must complete before Phase 2; Phase 2 before Phase 3.
- Within each phase, BE and FE tracks are independent.
- FE-2.3 and FE-2.4 depend on BE-2.2 being deployed (availability endpoint).
- FE-3.1 depends on BE-3.1 and BE-3.2 (Google events endpoint + merged conflict detection).
