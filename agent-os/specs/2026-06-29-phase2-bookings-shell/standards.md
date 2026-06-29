# Standards — Phase 2 Bookings CRUD + App Shell

## backend/nestjs-modules
Feature module at `src/bookings/`. Input DTOs use `class-validator`. Output DTOs use `@Exclude()` + `@Expose()` + `plainToInstance({ excludeExtraneousValues: true })`. Each decorator on its own line, blank line between properties.

## backend/error-handling
`GlobalExceptionFilter` already registered. Services throw `NotFoundException` (never plain `Error`). Wrong-owner access → 404 (not 403) to avoid leaking existence.

## frontend/component-architecture
Layout chrome in `components/layout/`. User data in `features/users/` (api.ts + hooks/ + types.ts). Shell components are `"use client"` (need `usePathname`). Layout file stays a Server Component — delegates client boundary to `AppShell`.

## frontend/tailwind-tokens
Named utilities only: `bg-coral`, `text-brown`, `bg-cream`, `text-teal`. Font utilities: `font-quicksand` (logo/brand), `font-figtree` inherited from body. No `text-[var(--color-*)]` or `font-[family-name:...]`.
