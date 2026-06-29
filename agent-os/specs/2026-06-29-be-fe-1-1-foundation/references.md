# References for BE-1.1 + FE-1.1

## Visual Reference

- **Location:** `Nook Design/` (repo root)
- **Key files:**
  - `Nook Design System.html` — full color palette, typography, components
  - `screenshots/components/color-palette.png` — Nook color swatches
  - `screenshots/components/typography.png` — font usage examples
  - `screenshots/desktop/01-login.png` — first screen to implement

## Existing Infrastructure

- **Prisma service:** `apps/api/src/shared/prisma/prisma.service.ts` — already wired as a global provider via `SharedModule`
- **Env validation:** `apps/api/src/config/env.validation.ts` — Joi schema; `DATABASE_URL` and `JWT_SECRET` already required
- **globals.css:** `apps/web/app/globals.css` — Tailwind v4 with `@theme inline`; existing oklch tokens to be remapped
