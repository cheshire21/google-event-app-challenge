# References for FE-3.1 + BE-3.1 Calendar View

## Backend References

### AvailabilityQueryDto — date-range DTO pattern
- **Location:** `apps/api/src/bookings/dto/availability-query.dto.ts`
- **Relevance:** Pattern for `BookingRangeQueryDto` (`startFrom`/`startTo` optional ISO date params)

### BookingsService.findAll — Prisma date filter pattern
- **Location:** `apps/api/src/bookings/bookings.service.ts`
- **Relevance:** Where to add `startTime: { gte, lte }` filter

### PaginationQueryDto — base DTO
- **Location:** `apps/api/src/shared/dto/pagination-query.dto.ts`
- **Relevance:** Compose with date-range params for bookings filter

## Frontend References

### NewBookingDialog — reused for click-to-book
- **Location:** `apps/web/features/bookings/components/NewBookingDialog.tsx`
- **Relevance:** Reused when user clicks empty calendar slot; pass `initialValues` with clicked date/time

### EditBookingDialog — reused for click-to-edit
- **Location:** `apps/web/features/bookings/components/EditBookingDialog.tsx`
- **Relevance:** Reused when user clicks a booking event block

### bookings/utils.ts — date utils to be extracted
- **Location:** `apps/web/features/bookings/utils.ts`
- **Relevance:** `getMondayOfWeek`, `getWeekDays`, `toLocalISODate` move to `utils/date.ts`

### useCheckAvailability — query hook pattern
- **Location:** `apps/web/features/bookings/hooks/useCheckAvailability.ts`
- **Relevance:** Pattern for `useCurrentUser` hook (conditional enabled, staleTime)
