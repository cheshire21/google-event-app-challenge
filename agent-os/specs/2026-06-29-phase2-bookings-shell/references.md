# References — Phase 2 Bookings CRUD + App Shell

## `apps/api/src/users/users.service.ts`
- **Relevance:** Ownership-scoped service pattern — `findById(id)` throws NotFoundException, returns ResponseDto via `plainToInstance`
- **Key pattern:** `toDto` helper + `excludeExtraneousValues: true`

## `apps/api/src/users/dto/user-response.dto.ts`
- **Relevance:** Output DTO template — `@Exclude()` on class, `@Expose()` per field

## `apps/api/src/test/factories/user.factory.ts`
- **Relevance:** `AbstractFactory<T>` pattern — extend for `BookingFactory`

## `apps/web/features/auth/hooks/useAuth.ts`
- **Relevance:** React Query hook pattern inside a feature — follow for `useCurrentUser`

## `apps/web/app/(dashboard)/layout.tsx`
- **Relevance:** Current layout to update — wrap children with `<AppShell>`

## `apps/web/features/auth/components/SignInPage.tsx`
- **Relevance:** Color token + font utility usage — `bg-coral`, `text-brown`, `font-quicksand`
