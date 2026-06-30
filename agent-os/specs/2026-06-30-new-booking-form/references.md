# References for FE-2.3 New Booking Form

## Similar Implementations

### BookingCard — formatTime + color tokens
- **Location:** `apps/web/features/bookings/components/BookingCard.tsx`
- **Relevance:** `formatTime` helper (locale + h12 formatting) and `bg-coral/10 text-coral` pattern to borrow
- **Key patterns:** `toLocaleTimeString` with `hour12: true`, opacity modifiers on color tokens

### useBookings — React Query hook shape
- **Location:** `apps/web/features/bookings/hooks/useBookings.ts`
- **Relevance:** Shows how to type and export `useQuery`/`useInfiniteQuery` hooks in this codebase
- **Key patterns:** `queryKey` array, `enabled` flag, TypeScript return type annotation

### useIntersectionObserver — shared hook
- **Location:** `apps/web/hooks/useIntersectionObserver.ts`
- **Relevance:** Model for `hooks/useDebounce.ts` — shared hook in `apps/web/hooks/`, single-export function
- **Key patterns:** Generic `T` type param, `useEffect` cleanup

### shadcn Form + FormField
- **Location:** `apps/web/components/ui/form.tsx`
- **Relevance:** `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` — wraps react-hook-form
- **Key patterns:** `<FormField control={form.control} name="..." render={({ field }) => ...} />`

### AvailabilityService endpoint (BE)
- **Location:** `apps/api/src/bookings/availability.service.ts`
- **Relevance:** `GET /api/bookings/availability?start=&end=&excludeId=` returns `{ available: boolean, conflicts: ConflictItemResponseDto[] }`
- **Key patterns:** `start`/`end` as ISO 8601 strings, optional `excludeId` UUID
