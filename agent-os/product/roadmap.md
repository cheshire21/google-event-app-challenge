---
name: product-roadmap
description: MVP feature set and post-launch phases for Nook
metadata:
  type: project
---

# Product Roadmap

## Phase 1: MVP

- **Authentication** — Google-only sign-in via Auth0; issues JWT and links the user's Google Calendar.
- **Dashboard** — Bookings list with stats cards (total, upcoming, today); empty state for new users.
- **Week Calendar View** — Display the user's own bookings alongside read-only Google Calendar events in a weekly grid.
- **Create Booking** — Name + day + time form; real-time conflict check against in-app bookings and Google Calendar; blocked on conflict, confirmed when free.
- **Edit / Reschedule** — Drag on the calendar or open an edit form; conflict re-checked on drop or save.
- **Cancel Booking** — Guarded by a confirmation dialog before deletion.
- **Google Calendar Connect / Disconnect** — Settings page to connect or disconnect read-only Google Calendar sync.
- **Responsive layout** — Sidebar + multi-column on desktop; top bar, bottom nav, and FAB on mobile (breakpoint 760 px).

## Phase 2: Post-Launch

- Shareable public booking links (external guests book slots without signing in)
- Email / push notifications for upcoming bookings
- Multi-calendar support (multiple Google accounts or other providers)
- Team / resource scheduling (assign bookings to specific people or rooms)
