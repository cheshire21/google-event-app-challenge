# NestJS Best Practices (API)

## REST Conventions

- Plural nouns, kebab-case URLs. Global prefix is `/api`.
- `DELETE` always uses `@HttpCode(HttpStatus.NO_CONTENT)` — 204, no body.
- All `:id` params use `ParseUUIDPipe`.
- Services throw NestJS built-in exceptions (`NotFoundException`, `ConflictException`, etc.) — never plain `Error`.
- Use `ConfigService.getOrThrow<T>('KEY')` — never `process.env` inside modules.

| Method | URL | Status |
|--------|-----|--------|
| GET | /api/resources | 200 |
| GET | /api/resources/:id | 200 |
| POST | /api/resources | 201 |
| PATCH | /api/resources/:id | 200 |
| DELETE | /api/resources/:id | 204 |

---

## DTO Naming Conventions

| Suffix | Role | Used with |
|---|---|---|
| `Create<Feature>Dto` | Body input for POST | `@Body()` |
| `Update<Feature>Dto` | Body input for PATCH | `@Body()` |
| `<Feature>QueryDto` | Query string input | `@Query()` |
| `<Feature>ResponseDto` | Single-item output | service return, `@ApiOkResponse` |
| `Paginated<Feature>ResponseDto` | Paginated list output | extends `PagedResponseDto<FeatureResponseDto>` |

NestJS docs use no stricter convention than `Dto` suffix — the prefixes above are this project's standard.

---

## Pagination

All list endpoints use **page-based pagination** via `PaginationQueryDto`. Each feature defines its own `Paginated<Feature>ResponseDto` (extends the shared generic) so Swagger gets a concrete named type.

### `PaginationQueryDto` (shared, lives in `src/shared/dto/pagination-query.dto.ts`)
```ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
```

### `PagedResponseDto<T>` (shared, lives in `src/shared/dto/paged-response.dto.ts`)
```ts
export class PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PagedResponseDto<T> {
  data: T[];
  meta: PageMeta;
}
```

### Per-feature paginated DTO (lives in `src/<feature>/dto/paginated-<feature>-response.dto.ts`)

Override `data` with `@Type()` — TypeScript generics are erased at runtime so class-transformer can't infer `T` from `PagedResponseDto<T>`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PagedResponseDto } from '@/shared/dto/paged-response.dto';
import { <Feature>ResponseDto } from './<feature>-response.dto';

export class Paginated<Feature>ResponseDto extends PagedResponseDto<<Feature>ResponseDto> {
  @Expose()
  @ApiProperty({ type: [<Feature>ResponseDto] })
  @Type(() => <Feature>ResponseDto)
  data: <Feature>ResponseDto[];
}
```

### Service pattern
```ts
async findAll(userId: string, { page, limit }: PaginationQueryDto): Promise<Paginated<Feature>ResponseDto> {
  const [items, total] = await Promise.all([
    this.prisma.<feature>.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.<feature>.count({ where: { userId } }),
  ]);
  return plainToInstance(
    Paginated<Feature>ResponseDto,
    { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } },
    { excludeExtraneousValues: true },
  );
}
```

### Controller pattern
```ts
@Get()
@ApiOkResponse({ type: Paginated<Feature>ResponseDto })
findAll(
  @CurrentUser() { userId }: CurrentUserDto,
  @Query() query: PaginationQueryDto,
) {
  return this.featureService.findAll(userId, query);
}
```

---

## Templates

### Input DTO (request body)
```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Create<Feature>Dto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  // add more fields with a blank line between each property block
}
```

### Update DTO (input)
```ts
import { PartialType } from '@nestjs/swagger';
import { Create<Feature>Dto } from './create-<feature>.dto';

export class Update<Feature>Dto extends PartialType(Create<Feature>Dto) {}
```

### Response DTO (output)
```ts
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class <Feature>ResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  // only add @Expose() to fields that should leave the service layer
  // internal fields (e.g. auth0Id) are omitted — no @Expose() = excluded
}
```

### Service
```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class <Feature>Service {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const records = await this.prisma.<feature>.findMany();
    return plainToInstance(<Feature>ResponseDto, records, { excludeExtraneousValues: true });
  }

  async findOne(id: string) {
    const record = await this.prisma.<feature>.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`<Feature> ${id} not found`);
    return plainToInstance(<Feature>ResponseDto, record, { excludeExtraneousValues: true });
  }

  async create(dto: Create<Feature>Dto) {
    const record = await this.prisma.<feature>.create({ data: dto });
    return plainToInstance(<Feature>ResponseDto, record, { excludeExtraneousValues: true });
  }

  async update(id: string, dto: Update<Feature>Dto) {
    await this.findOne(id);
    const record = await this.prisma.<feature>.update({ where: { id }, data: dto });
    return plainToInstance(<Feature>ResponseDto, record, { excludeExtraneousValues: true });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.<feature>.delete({ where: { id } });
  }
}
```

### Controller
```ts
import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('<feature>s')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('<feature>s')
export class <Feature>Controller {
  constructor(private readonly <feature>Service: <Feature>Service) {}

  @Get()
  @ApiOkResponse({ type: [<Feature>ResponseDto] })
  findAll() { return this.<feature>Service.findAll(); }

  @Get(':id')
  @ApiOkResponse({ type: <Feature>ResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.<feature>Service.findOne(id); }

  @Post()
  @ApiCreatedResponse({ type: <Feature>ResponseDto })
  create(@Body() dto: Create<Feature>Dto) { return this.<feature>Service.create(dto); }

  @Patch(':id')
  @ApiOkResponse({ type: <Feature>ResponseDto })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Update<Feature>Dto) {
    return this.<feature>Service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.<feature>Service.remove(id); }
}
```

### Module
```ts
import { Module } from '@nestjs/common';

@Module({
  controllers: [<Feature>Controller],
  providers: [<Feature>Service],
})
export class <Feature>Module {}
```

---

## Environment Variables

| Variable | Type | Notes |
|---|---|---|
| `DATABASE_URL` | string | Built from POSTGRES_* vars |
| `POSTGRES_USER/PASSWORD/DB/HOST/PORT` | string | PostgreSQL connection |
| `JWT_SECRET` | string | Signs JWT tokens |
| `PORT` | number | Defaults to `3001` |
