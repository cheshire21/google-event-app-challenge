# Standards for BE-4.1 + FE-4.1

## backend/error-handling

Relevant for `PrismaExceptionFilter`.

- Use `@Catch(Prisma.PrismaClientKnownRequestError)` to narrow the filter to Prisma errors only
- Never expose raw Prisma error messages or stack traces to the client
- Map known codes: `P2025` → 404 Not Found, `P2002` → 409 Conflict, unknown → 500 with `'Internal server error'`
- Response shape: `{ statusCode, message, timestamp }`
- Register more-specific filters before the global catch-all in `main.ts`

## frontend/component-architecture

Relevant for skeleton file placement.

- Each component lives in its own folder with `ComponentName.tsx`, `ComponentName.spec.tsx`, `index.ts`
- Co-locate closely related files inside the same folder (e.g. `StatsCardSkeleton` inside `StatsCards/`)
- New top-level components (`CalendarSkeleton`) get their own folder

## frontend/tailwind-tokens

Relevant for skeleton styling.

- Use `bg-brown/10` for skeleton placeholders — visible on cream background, consistent with `BookingSkeletons.tsx`
- Never hardcode hex colors; use named token utilities
