# References for FE-3.2 + BE-3.2 — Google Conflict Detection + Connect Settings Page

## Backend References

### AvailabilityService — file to extend
- **Location:** `apps/api/src/bookings/availability.service.ts`
- **Relevance:** Currently queries only bookings; inject `GoogleCalendarService` and merge Google events when `user.hasGoogleCalendar`

### GoogleCalendarService.getEvents — ready to call
- **Location:** `apps/api/src/google-calendar/google-calendar.service.ts`
- **Relevance:** Returns `CalendarEventDto[]` with `{ id, title, startTime, endTime, type: 'google' }`; handles token refresh internally

### ConflictItemResponseDto — DTO to update
- **Location:** `apps/api/src/bookings/dto/availability-response.dto.ts`
- **Relevance:** Change `type: 'booking'` → `type: 'booking' | 'google'`

### BookingsModule — add GoogleCalendarModule import
- **Location:** `apps/api/src/bookings/bookings.module.ts`
- **Relevance:** `GoogleCalendarModule` must be imported here so `GoogleCalendarService` can be injected into `AvailabilityService`

## Frontend References

### features/users/types.ts — User type to extend
- **Location:** `apps/web/features/users/types.ts`
- **Relevance:** Add `hasGoogleCalendar: boolean`; Sidebar and `GoogleCalendarCard` both consume this type via `useCurrentUser`

### features/users/hooks/useCurrentUser — shared hook
- **Location:** `apps/web/features/users/hooks/useCurrentUser.ts`
- **Relevance:** `queryKey: ['currentUser']`; Sidebar already imports this; `GoogleCalendarCard` should import from here to share the cache

### Sidebar — badge to make conditional
- **Location:** `apps/web/components/layout/Sidebar.tsx`
- **Relevance:** Hardcoded "On" badge on `/connect` link; gate on `user?.hasGoogleCalendar`

### ConflictWarning — message to branch
- **Location:** `apps/web/features/bookings/components/ConflictWarning.tsx`
- **Relevance:** Hardcoded "in your bookings"; add branch for `type === 'google'`

### features/bookings/types.ts — ConflictEntry type
- **Location:** `apps/web/features/bookings/types.ts`
- **Relevance:** `ConflictEntry.type` must allow `'google'` alongside `'booking'`

### useDeleteBooking — mutation hook pattern
- **Location:** `apps/web/features/bookings/hooks/useDeleteBooking.ts`
- **Relevance:** Pattern for `useDisconnectCalendar` (mutation → on success invalidate query)
