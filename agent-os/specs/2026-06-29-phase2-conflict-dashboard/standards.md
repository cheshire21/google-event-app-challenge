# Standards — Conflict Detection + Dashboard Page

## backend/nestjs-modules
`ConflictService` is a plain `@Injectable()` registered in `BookingsModule` providers — no separate module. `PaginationQueryDto` and `PagedResponseDto<T>` go in `src/shared/dto/` so all features can reuse them.

## backend/error-handling
No new exception types. `ConflictService` returns data — it does not throw. The controller decides whether to return 409 based on the result (used in GOO-16 new-booking form, not here).

## frontend/component-architecture
All booking UI in `features/bookings/`. Shared `useIntersectionObserver` hook goes in `hooks/` (used by 2+ features eventually). Page at `app/(dashboard)/dashboard/page.tsx` is a thin wrapper — no logic.

## frontend/tailwind-tokens
Named utilities only: `bg-coral`, `text-brown`, `bg-cream`, `text-teal`. `font-quicksand` for headings/brand, body inherits `font-figtree` globally. No arbitrary `var(--color-*)` or `font-[family-name:...]`.

## frontend/pagination
Use `useInfiniteQuery` per skill. Flatten: `data?.pages.flatMap(p => p.data) ?? []`. Sentinel `<div ref={sentinelRef} className="h-4" />` is the last element in the scroll container.
