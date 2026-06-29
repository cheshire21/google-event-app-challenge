# NestJS Architecture

## Folder Structure

```
apps/api/src/
├── config/
│   └── env.validation.ts              # Joi env schema
├── shared/                            # @Global() infrastructure
│   ├── filters/
│   │   └── http-exception.filter.ts   # GlobalExceptionFilter (registered in main.ts)
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   └── shared.module.ts
├── <feature>/                         # Feature modules (one folder per feature)
│   ├── dto/
│   ├── entities/
│   ├── <feature>.controller.ts
│   ├── <feature>.service.ts
│   └── <feature>.module.ts
├── app.module.ts
└── main.ts
```

---

## Module Organization Rules

- `SharedModule` is `@Global()` — feature modules never import it directly, they just inject its services
- `AppModule` imports only: `ConfigModule`, `SharedModule`, and feature modules
- Feature modules are self-contained: controller + service + module file, nothing else at the module level
- Use `@/` path alias instead of relative paths (`@/shared/prisma/prisma.service`)
- Every new env var goes in: `env.validation.ts` (Joi schema) + `.env` + `.env.example`

---

## Checklist: New Feature Module

1. Create `src/<feature>/` with `dto/` subdir
2. Input DTO(s) — `class-validator` decorators + `@ApiProperty()`
3. Output DTO — `@Exclude()` class + `@Expose()` on each public field + `@ApiProperty()`
4. Service — inject `PrismaService`, return `plainToInstance(XResponseDto, result, { excludeExtraneousValues: true })`, throw correct exceptions
5. Controller — thin, correct HTTP codes, `ParseUUIDPipe` on `:id`
6. Module file
7. Register in `AppModule`

---

## Key Files

- `src/shared/shared.module.ts` — add new global services here
- `src/app.module.ts` — register feature modules here
- `src/main.ts` — global prefix `/api`, `GlobalExceptionFilter`, `ValidationPipe`, CORS, Swagger at `/docs`
- `src/config/env.validation.ts` — Joi env schema; update when adding env vars
- `prisma/schema.prisma` — run `pnpm --filter=api prisma:migrate` after model changes
