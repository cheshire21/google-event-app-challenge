# References for FE-2.5 Cancel Booking Dialog

## Similar Implementations

### NewBookingDialog — self-contained dialog + mutation
- **Location:** `apps/web/features/bookings/components/NewBookingDialog.tsx`
- **Relevance:** Same pattern — owns `open` state, `DialogTrigger asChild`, wires mutation to close on success
- **Key patterns:** `useState(false)` for open; `mutate(payload, { onSuccess: () => setOpen(false) })`

### EditBookingDialog — dialog with `booking` prop
- **Location:** `apps/web/features/bookings/components/EditBookingDialog.tsx`
- **Relevance:** `CancelConfirmDialog` also receives `booking: Booking` + `trigger: ReactNode`; same shell structure
- **Key patterns:** Self-contained hook call inside the dialog component

### useUpdateBooking — mutation hook pattern
- **Location:** `apps/web/features/bookings/hooks/useUpdateBooking.ts`
- **Relevance:** `useDeleteBooking` follows the same structure (takes `id`, calls API, invalidates `['bookings']`)

### bookings/api.ts — API call pattern
- **Location:** `apps/web/features/bookings/api.ts`
- **Relevance:** `deleteBooking` needs to be added here; follows existing GET/PATCH patterns
