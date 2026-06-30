# References for FE-2.4 Edit Booking Dialog

## Similar Implementations

### NewBookingDialog — dialog wrapper pattern
- **Location:** `apps/web/features/bookings/components/NewBookingDialog.tsx`
- **Relevance:** Identical structure — owns `open` state, `DialogTrigger asChild`, wires mutation to `BookingForm`
- **Key patterns:** `useState(false)` for open; `mutate(payload, { onSuccess: () => setOpen(false) })`

### BookingForm — reusable form
- **Location:** `apps/web/features/bookings/components/BookingForm.tsx`
- **Relevance:** `initialValues?: Partial<BookingFormValues>`, `excludeId?: string`, `onCancel?: () => void` props already exist for edit mode
- **Key patterns:** Zod schema with `date` + `startTime` + `endTime`; `useCheckAvailability` with `excludeId`

### useCreateBooking — mutation hook pattern
- **Location:** `apps/web/features/bookings/hooks/useCreateBooking.ts`
- **Relevance:** Pattern for `useUpdateBooking` — `useMutation` + `invalidateQueries(['bookings'])`
- **Key patterns:** No router navigation in the hook; caller decides post-success behaviour

### bookings/utils.ts — utility home
- **Location:** `apps/web/features/bookings/utils.ts`
- **Relevance:** `bookingToFormValues` goes here alongside `formatTime`, `toLocalISODate`, etc.
- **Key patterns:** Pure functions, no React imports
