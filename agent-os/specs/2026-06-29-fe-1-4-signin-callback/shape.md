# FE-1.4 — Sign-in page + Auth0 callback handler

## Scope

Replace the `/login` placeholder with the full Nook sign-in UI. Add `/callback` route that exchanges the Auth0 token for an app JWT and stores it in localStorage.

## Decisions

- `SignInPage` is a `"use client"` component in `features/auth/components/` — not a page itself
- `/callback` lives at root level (`app/callback/`) to avoid the `(auth)` AuthGuard intercepting it during token exchange
- `providers.tsx` updated to add `authorizationParams.redirect_uri` pointing to `/callback`
- Design tokens only — no hardcoded hex values

## Context

- **Visuals:** `Nook Design/screenshots/desktop/01-login.png` — two-panel split layout
- **References:** `features/auth/hooks/useAuth.ts`, `lib/api.ts`, `features/auth/components/AuthGuard.spec.tsx`
- **Product alignment:** Completes Phase 1 auth foundation — unblocks Phase 2

## Standards Applied

- `frontend/component-architecture` — `features/auth/` layout, thin page wrappers
- `frontend/tailwind-tokens` — CSS variables only, no raw hex
