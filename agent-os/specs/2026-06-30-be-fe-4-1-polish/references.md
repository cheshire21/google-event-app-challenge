# References for BE-4.1 + FE-4.1

## Backend

### GlobalExceptionFilter (existing)
- **Location:** `apps/api/src/shared/filters/http-exception.filter.ts`
- **Relevance:** `PrismaExceptionFilter` follows the same `ExceptionFilter` interface and response shape
- **Key patterns:** `host.switchToHttp()`, `response.status(status).json({ statusCode, message, timestamp })`

### main.ts (existing)
- **Location:** `apps/api/src/main.ts`
- **Relevance:** Where both filters are registered and Swagger is configured

## Frontend

### BookingSkeletons (existing)
- **Location:** `apps/web/features/bookings/components/BookingsList/BookingSkeletons.tsx`
- **Relevance:** Pattern for skeleton components — `bg-brown/10`, `rounded-xl`, fixed height
- **Key patterns:** `<Skeleton className="h-[90px] w-full rounded-xl bg-brown/10" />`

### useCalendarEvents (existing)
- **Location:** `apps/web/features/calendar/hooks/useCalendarEvents.ts`
- **Relevance:** Already returns `{ events, isLoading }` — just needs to be wired into `WeekCalendar`

### useBookingStats (existing)
- **Location:** `apps/web/features/bookings/hooks/useBookingStats.ts`
- **Relevance:** Calls `useBookings()` which has `isLoading` — needs to expose it in the return value
