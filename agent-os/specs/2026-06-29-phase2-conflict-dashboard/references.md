# References — Conflict Detection + Dashboard Page

## `apps/api/src/bookings/bookings.service.ts`
- **Relevance:** Pattern for injectable service using PrismaService, `plainToInstance` usage
- **Key pattern:** Ownership-scoped Prisma queries

## `apps/api/src/bookings/bookings.service.spec.ts`
- **Relevance:** Test structure — `BookingFactory`, describe-scoped `let booking`, `prismaMock`
- **Key pattern:** Follow exactly for `conflict.service.spec.ts`

## `apps/api/src/bookings/bookings.controller.ts`
- **Relevance:** Route ordering matters — `@Get('availability')` must come before `@Get(':id')`

## `apps/web/features/users/hooks/useCurrentUser.ts`
- **Relevance:** React Query hook pattern to follow for `useBookings` and `useBookingStats`

## `apps/web/components/layout/Sidebar.tsx`
- **Relevance:** Color token + font utility usage reference (`bg-coral`, `text-brown`, `font-quicksand`)

## `.claude/skills/nextjs-architecture.md` — Pagination & Infinite Scroll section
- **Relevance:** `useInfiniteQuery` template, `useIntersectionObserver` shared hook, list component pattern
