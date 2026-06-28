# NestJS REST API — Best Practices & Architecture

Reference this skill when creating, editing, or reviewing any code in `apps/api/`.

---

## Folder Structure

```
apps/api/src/
├── shared/                        # @Global() infrastructure — imported once in AppModule
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   └── shared.module.ts           # @Global() wrapper — exports everything in shared/
│
├── modules/                       # Feature modules (business logic)
│   └── <feature>/
│       ├── dto/
│       │   ├── create-<feature>.dto.ts
│       │   └── update-<feature>.dto.ts
│       ├── entities/
│       │   └── <feature>.entity.ts
│       ├── <feature>.controller.ts
│       ├── <feature>.service.ts
│       └── <feature>.module.ts
│
├── app.module.ts                  # Root — imports ConfigModule + SharedModule + feature modules
└── main.ts                        # Bootstrap — global prefix, ValidationPipe, CORS, Swagger
```

---

## REST URL Conventions

- **Plural nouns** for resources, **kebab-case** for multi-word resources
- **No verbs** in URLs — the HTTP method is the verb
- Global prefix is `/api` — all routes are under `/api/`

| Method   | URL                  | Action              | Status |
|----------|----------------------|---------------------|--------|
| GET      | /api/events          | List all            | 200    |
| GET      | /api/events/:id      | Get one             | 200    |
| POST     | /api/events          | Create              | 201    |
| PATCH    | /api/events/:id      | Partial update      | 200    |
| DELETE   | /api/events/:id      | Delete              | 204    |

✅ `/api/events` ✅ `/api/calendar-events`
❌ `/api/getEvents` ❌ `/api/event/create`

---

## HTTP Status Codes

Always use the correct decorator — NestJS defaults to 200 for everything except POST (201).

```ts
@Post()                              // 201 by default ✅
@Patch(':id')                        // 200 by default ✅
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)     // must set 204 manually
```

| Situation              | Code | NestJS exception                  |
|------------------------|------|-----------------------------------|
| Success list/get/patch | 200  | —                                 |
| Created                | 201  | —                                 |
| Deleted                | 204  | —                                 |
| Bad input              | 400  | `BadRequestException`             |
| Unauthenticated        | 401  | `UnauthorizedException`           |
| No permission          | 403  | `ForbiddenException`              |
| Not found              | 404  | `NotFoundException`               |
| Conflict (duplicate)   | 409  | `ConflictException`               |

---

## Core Rules

### SharedModule
- `SharedModule` is `@Global()` — its exports are available in every module without importing it again.
- Feature modules **never** import `SharedModule` directly. They just inject its services.
- Add new infrastructure (cache, mailer, storage) as sub-modules inside `shared/` and export them from `SharedModule`.

### AppModule
- Only imports: `ConfigModule.forRoot({ isGlobal: true })`, `SharedModule`, and feature modules.
- Never import `PrismaModule` directly — it comes through `SharedModule`.

### Feature Modules
- One folder per feature inside `src/modules/`.
- Self-contained: module + controller + service + DTOs + entities.
- Import other feature modules only when there is a real dependency. Avoid circular imports.
- Register every new feature module in `AppModule`.

---

## Checklist: Creating a New Feature Module

1. Create `src/modules/<feature>/` with `dto/` and `entities/` subdirectories
2. Create the entity class (mirrors the Prisma model, used for Swagger response typing)
3. Create DTOs with `class-validator` + `@ApiProperty` on every field
4. Create the service — inject `PrismaService`, throw correct exceptions
5. Create the controller — thin, correct HTTP codes, `ParseUUIDPipe` on all `:id` params
6. Create the module file
7. Register the module in `AppModule`

---

## Templates

### Entity (`entities/<feature>.entity.ts`)
```ts
import { ApiProperty } from '@nestjs/swagger';

export class <Feature>Entity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

### Create DTO (`dto/create-<feature>.dto.ts`)
```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Create<Feature>Dto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### Update DTO (`dto/update-<feature>.dto.ts`)
```ts
import { PartialType } from '@nestjs/swagger';
import { Create<Feature>Dto } from './create-<feature>.dto';

export class Update<Feature>Dto extends PartialType(Create<Feature>Dto) {}
```

### Query DTO — for list endpoints with filtering/pagination (`dto/query-<feature>.dto.ts`)
```ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class Query<Feature>Dto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;
}
```

### Service (`<feature>.service.ts`)
```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Create<Feature>Dto } from './dto/create-<feature>.dto';
import { Update<Feature>Dto } from './dto/update-<feature>.dto';
import { Query<Feature>Dto } from './dto/query-<feature>.dto';

@Injectable()
export class <Feature>Service {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: Query<Feature>Dto) {
    const { page = 1, limit = 20 } = query;
    return this.prisma.<feature>.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.<feature>.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`<Feature> ${id} not found`);
    return record;
  }

  create(dto: Create<Feature>Dto) {
    return this.prisma.<feature>.create({ data: dto });
  }

  async update(id: string, dto: Update<Feature>Dto) {
    await this.findOne(id);
    return this.prisma.<feature>.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.<feature>.delete({ where: { id } });
  }
}
```

### Controller (`<feature>.controller.ts`)
```ts
import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { <Feature>Service } from './<feature>.service';
import { <Feature>Entity } from './entities/<feature>.entity';
import { Create<Feature>Dto } from './dto/create-<feature>.dto';
import { Update<Feature>Dto } from './dto/update-<feature>.dto';
import { Query<Feature>Dto } from './dto/query-<feature>.dto';

@ApiTags('<feature>s')
@Controller('<feature>s')
export class <Feature>Controller {
  constructor(private readonly <feature>Service: <Feature>Service) {}

  @Get()
  @ApiOkResponse({ type: [<Feature>Entity] })
  findAll(@Query() query: Query<Feature>Dto) {
    return this.<feature>Service.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: <Feature>Entity })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.<feature>Service.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: <Feature>Entity })
  create(@Body() dto: Create<Feature>Dto) {
    return this.<feature>Service.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: <Feature>Entity })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Update<Feature>Dto) {
    return this.<feature>Service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.<feature>Service.remove(id);
  }
}
```

### Module (`<feature>.module.ts`)
```ts
import { Module } from '@nestjs/common';
import { <Feature>Controller } from './<feature>.controller';
import { <Feature>Service } from './<feature>.service';

@Module({
  controllers: [<Feature>Controller],
  providers: [<Feature>Service],
})
export class <Feature>Module {}
```

---

## Conventions

| What | Convention |
|---|---|
| URL resources | Plural nouns, kebab-case (`/calendar-events`) |
| Module folders | `kebab-case` |
| Class names | `PascalCase` |
| ID params | Always use `ParseUUIDPipe` — validates UUID format, returns 400 on bad input |
| DTOs | `class-validator` + `@ApiProperty` on every field |
| Entities | Mirror Prisma model, used as Swagger response type |
| DELETE | Always `@HttpCode(HttpStatus.NO_CONTENT)` — returns 204, no body |
| Errors | NestJS built-in exceptions with descriptive messages |
| Config | `ConfigService.getOrThrow<T>('KEY')` — never `process.env` inside modules |
| Prisma | Import from `../../shared/prisma/prisma.service` |

---

## Environment & Config Validation

All env vars are validated at startup via Joi in `app.module.ts`. The app **will not start** if a required var is missing.

Add every new env var in three places:
1. `apps/api/src/config/env.validation.ts` — Joi schema
2. `apps/api/.env` — local value
3. `apps/api/.env.example` — documented template (committed)

| Variable | Type | Notes |
|---|---|---|
| `DATABASE_URL` | string | PostgreSQL connection string |
| `JWT_SECRET` | string | Signs JWT tokens |
| `PORT` | number | Defaults to `3001` |

---

## Key Files
- `src/shared/shared.module.ts` — add new global services here
- `src/app.module.ts` — register new feature modules here
- `src/main.ts` — global prefix `/api`, ValidationPipe, CORS, Swagger
- `prisma/schema.prisma` — run `pnpm --filter=api prisma:migrate` after model changes
- Swagger UI: `http://localhost:3001/docs`
