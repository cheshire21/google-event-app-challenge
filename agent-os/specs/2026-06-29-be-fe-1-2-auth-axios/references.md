# References for BE-1.2 + FE-1.2

## Backend

### PrismaService (global provider)
- **Location:** `apps/api/src/shared/prisma/prisma.service.ts`
- **Relevance:** Available in `AuthModule` via `SharedModule` — no need to re-import
- **Key pattern:** Inject as `PrismaService` directly in `AuthService`

### Prisma Mock
- **Location:** `apps/api/src/test/mocks/prisma.mock.ts`
- **Relevance:** `createPrismaMock()` must have `user: mockModel()` uncommented before auth tests can run
- **Key pattern:** `{ provide: PrismaService, useValue: createPrismaMock() }`

### App Module
- **Location:** `apps/api/src/app.module.ts`
- **Relevance:** `AuthModule` must be imported here to register the JWT strategy globally

## Frontend

### lib/utils.ts
- **Location:** `apps/web/lib/utils.ts`
- **Relevance:** Pattern for shared lib files — simple named exports, no framework dependencies
- **Key pattern:** `export function` / `export const` at module level
