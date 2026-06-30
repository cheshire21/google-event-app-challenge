# FE-3.1 + BE-3.1 Calendar View — Shaping Notes

## Scope

Phase 3 MVP: a week calendar view showing the user's own bookings (coral) alongside read-only Google Calendar events (teal). BE-3.1 adds the Google OAuth flow, token storage, and a proxy events endpoint. FE-3.1 builds the week grid page with week navigation, event rendering, click-to-book, and click-to-edit.

## Decisions

- **Google OAuth via googleapis** — backend proxy; frontend never calls Google APIs directly
- **State JWT** — OAuth `state` param is a signed JWT (`{ userId }`, 10-min expiry, `JWT_SECRET`) to prevent CSRF and tie callback to user
- **`GET /users/me`** — added so frontend knows `hasGoogleCalendar` status; gates the Google events query
- **Bookings date-range filter** — `GET /bookings?startFrom=&startTo=` added to avoid fetching all pages for the calendar week view
- **`@Public()` on callback** — callback has no JWT guard; state JWT serves as authentication
- **Custom calendar grid** — no third-party library; Tailwind absolute positioning with `getTopPercent`/`getHeightPercent` utils
- **Calendar hours** — 8 AM to 9 PM (13 hours visible)
- **Click-to-book** — clicking empty slot opens `NewBookingDialog` pre-filled with clicked time
- **No drag-and-drop** — instruction text shown but drag not implemented in this ticket
- **Shared date utils** — `getMondayOfWeek`, `getWeekDays`, `toLocalISODate` moved from `features/bookings/utils.ts` to `utils/date.ts` (shared app layer) since calendar feature also needs them

## Context

- **Visuals:** `Nook Design/screenshots/desktop/04-calendar.png`, `Nook Design/screenshots/mobile/04-calendar.png`
- **Google credentials:** Set up in `apps/api/.env`; OAuth consent screen in External/Testing mode — user email must be added as test user
- **References:** `AvailabilityQueryDto` (date-range DTO pattern), `NewBookingDialog`/`EditBookingDialog` (reused in calendar)

## Standards Applied

- `backend/nestjs-modules` — module layout, DTO validation, guards, Swagger
- `backend/error-handling` — `BadRequestException` when no tokens
- `database/prisma` — migration naming, field order
- `testing/unit-tests` — Prisma mock, AbstractFactory
- `frontend/component-architecture` — feature-based, `"use client"` at leaves
- `frontend/tailwind-tokens` — coral/teal/brown/cream tokens
- `frontend/testing` — Vitest + RTL, QueryClientProvider wrapper
