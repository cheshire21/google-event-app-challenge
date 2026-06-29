# Nook — Google Calendar Booking App · Design Package

A warm, friendly UI design for a full-stack calendar booking app that prevents
double-booking against both in-app bookings and the user's Google Calendar.

## What's inside

- **Nook Design System.html** — Open this first. The full design documentation:
  color palette, typography, component primitives (buttons, inputs, badges,
  alerts, cards, navigation), every screen (desktop + mobile), and the user
  flows. Self-contained — works offline, just double-click.

- **Nook Interactive Prototype.html** — The clickable, responsive prototype.
  Sign in, create / edit / cancel bookings, drag to reschedule on the calendar,
  and connect / disconnect Google Calendar. Live conflict detection throughout.
  Resize the window below ~760px to see the mobile layout. Self-contained.

- **screenshots/** — All exported images.
  - `desktop/` — the 10 web screens & states
  - `mobile/` — the responsive mobile screens
  - `components/` — close-ups of palette, type, and component primitives

## Design at a glance

- **Aesthetic:** warm, rounded, soft. Cream background, coral primary, calm teal
  for everything Google-related.
- **Type:** Quicksand (brand/logo) + Figtree (UI/body); Material Symbols Rounded.
- **Responsive:** sidebar + multi-column on web; top bar, bottom nav, and a FAB
  on mobile (breakpoint 760px).

## Screens

1. Sign in with Google (Auth0-brokered)
2. Dashboard — bookings list + stats
3. Empty state
4. Week calendar (your bookings + read-only Google events)
5. New booking — conflict warning
6. New booking — free slot
7. Edit / reschedule
8. Cancel confirmation
9. Connect Google — connected
10. Connect Google — disconnected

## Flows

- **A · Authentication** — Google-only sign-in via Auth0; issues JWT and links the calendar.
- **B · Create booking** — name + day + time → checked against bookings *and* Google → blocked on conflict, confirmed when free.
- **C · Reschedule** — drag on the calendar or edit name/day/time; re-checked on drop or save.
- **D · Cancel** — guarded by a confirmation dialog.
- **E · Connect / disconnect Google** — read-only sync used purely for conflict checks.

## Note on scope

These are front-end design artifacts (HTML). The NestJS API, Auth0, Postgres +
Prisma, Google Calendar integration, and Docker setup described in the
requirements would power this UI in the real build.
