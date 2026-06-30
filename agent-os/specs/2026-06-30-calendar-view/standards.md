# Standards for FE-3.1 + BE-3.1 Calendar View

The following standards apply to this work.

---

## backend/nestjs-modules

Feature module layout: controller → service → DTOs. Use `@ApiProperty()` on all DTO fields. Guards via `@UseGuards(JwtAuthGuard)`. Public routes marked with `@Public()`. Validate all query/body params with class-validator decorators.

---

## backend/error-handling

Use `HttpException` subclasses: `BadRequestException`, `NotFoundException`, `UnauthorizedException`. Never expose raw Prisma errors. Log full error server-side, return safe message to client.

---

## database/prisma

Field order: id → scalar fields → relations → timestamps. UUID PKs (`@default(uuid())`). Always include `createdAt`/`updatedAt`. Migration names: `snake_case` describing the change (e.g. `add_google_calendar_fields_to_user`).

---

## testing/unit-tests

Mock Prisma with `mockDeep<PrismaClient>()` from `jest-mock-extended`. Use `AbstractFactory` pattern for test data. Wire service in `beforeEach` with the mock. Reset mocks between tests.

---

## frontend/component-architecture

Pages in `app/` are thin server components. All logic lives in `features/<name>/`. `"use client"` pushed as far down the tree as possible. Features only import from `components/`, `hooks/`, `lib/`, `types/`, `utils/` — never from another feature.

---

## frontend/tailwind-tokens

Nook color utilities: `coral`, `teal`, `brown`, `cream`. Opacity modifiers (`bg-coral/20`, `border-teal`, `text-teal`). Never hardcode hex. Never use `text-[var(--color-*)]`.

---

## frontend/testing

Vitest + RTL + jsdom. Colocate spec files next to the component. Wrap every `render()` in a fresh `QueryClientProvider` with `retry: false`. Name the wrapper component (`const Wrapper = ...`) to avoid `react/display-name` lint error. Mock `next/navigation` with `vi.mock`.
