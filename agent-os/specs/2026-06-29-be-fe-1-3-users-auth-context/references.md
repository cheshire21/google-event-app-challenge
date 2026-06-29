# References for BE-1.3 + FE-1.3

## Backend

### Auth module
- **Location:** `apps/api/src/auth/`
- **Relevance:** Exact pattern to follow for users module — module/service/controller/dto/entity layout, `@/` alias usage
- **Key patterns:** `@UseGuards(JwtAuthGuard)` at controller level, `@CurrentUser()` param decorator, `@ApiTags` + `@ApiBearerAuth()`

### UserFactory
- **Location:** `apps/api/src/test/factories/user.factory.ts`
- **Relevance:** Use in `users.service.spec.ts` for realistic test data — `userFactory.make()` and `userFactory.make({ id: 'known-id' })`

## Frontend

### lib/api.ts
- **Location:** `apps/web/lib/api.ts`
- **Relevance:** Uses `localStorage.getItem('access_token')` — AuthContext must read the exact same key (`'access_token'`)

### nextjs-architecture skill
- **Location:** `.claude/skills/nextjs-architecture.md`
- **Relevance:** Contains complete code examples for `AuthContext` (useSyncExternalStore pattern), `AuthGuard` (sync null block + useEffect redirect), and route-group layouts
