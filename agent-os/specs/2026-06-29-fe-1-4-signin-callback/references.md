# References for FE-1.4

## `features/auth/components/AuthGuard.tsx`
- **Relevance:** Pattern for `"use client"` auth components — `useAuth0` mock pattern for tests
- **Key pattern:** `vi.mock('@auth0/auth0-react')` + `vi.mocked(useAuth0).mockReturnValue(...)`

## `apps/web/lib/api.ts`
- **Relevance:** Axios instance used by `exchangeToken` in `features/auth/api.ts`
- **Key pattern:** `api.post<T>(path, body).then(r => r.data)`

## `apps/web/app/providers.tsx`
- **Relevance:** Auth0Provider needs `authorizationParams.redirect_uri` added
- **Key pattern:** `typeof window !== 'undefined'` guard for SSR-safe `window.location.origin`

## `Nook Design/screenshots/desktop/01-login.png`
- **Relevance:** Design reference — two-panel layout, color palette, button style, copy
