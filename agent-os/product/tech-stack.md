---
name: product-tech-stack
description: Full tech stack for Nook — Google Calendar Booking App
metadata:
  type: project
---

# Tech Stack

## Frontend

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS (warm Nook design system — cream background, coral primary, teal for Google-related UI)
- **Fonts:** Quicksand (brand/logo), Figtree (UI/body), Material Symbols Rounded (icons)
- **State / Data Fetching:** React Query (TanStack Query) + Axios
- **Forms:** React Hook Form + Zod

## Backend

- **Framework:** NestJS 11 (Node.js 20)
- **Auth:** Auth0 (Google OAuth broker) + JWT (NestJS JWT guard)
- **ORM:** Prisma (schema-first)
- **API Documentation:** Swagger / OpenAPI (via `@nestjs/swagger`)
- **Validation:** `class-validator` + `class-transformer` with global `ValidationPipe`

## Database

- **Engine:** PostgreSQL 16
- **Schema:** Prisma (`User`, `Booking` models)

## External Integrations

- **Auth0** — Google OAuth sign-in; issues access tokens that the API exchanges for JWTs
- **Google Calendar API** — Read-only event listing for conflict detection

## Infrastructure / Tooling

- **Monorepo:** pnpm + Turborepo
- **Containerization:** Docker + Docker Compose (postgres, api, web services)
- **Shared packages:** `@repo/ui` (component library), `@repo/eslint-config`, `@repo/typescript-config`
- **Testing:** Jest (unit + e2e) for API; Jest + React Testing Library for web
