# NestJS Best Practices (API)

## REST Conventions

- Plural nouns, kebab-case URLs. Global prefix is `/api`.
- `DELETE` always uses `@HttpCode(HttpStatus.NO_CONTENT)` — 204, no body.
- All `:id` params use `ParseUUIDPipe`.
- DTOs use `class-validator` + `@ApiProperty` on every field.
- Services throw NestJS built-in exceptions (`NotFoundException`, `ConflictException`, etc.).
- Use `ConfigService.getOrThrow<T>('KEY')` — never `process.env` inside modules.

| Method | URL | Status |
|--------|-----|--------|
| GET | /api/resources | 200 |
| GET | /api/resources/:id | 200 |
| POST | /api/resources | 201 |
| PATCH | /api/resources/:id | 200 |
| DELETE | /api/resources/:id | 204 |

---

## Templates

### Entity
```ts
import { ApiProperty } from '@nestjs/swagger';

export class <Feature>Entity {
  @ApiProperty() id: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
```

### Create DTO
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

### Update DTO
```ts
import { PartialType } from '@nestjs/swagger';
import { Create<Feature>Dto } from './create-<feature>.dto';

export class Update<Feature>Dto extends PartialType(Create<Feature>Dto) {}
```

### Service
```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class <Feature>Service {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.<feature>.findMany();
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

### Controller
```ts
import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

@ApiTags('<feature>s')
@Controller('<feature>s')
export class <Feature>Controller {
  constructor(private readonly <feature>Service: <Feature>Service) {}

  @Get()
  @ApiOkResponse({ type: [<Feature>Entity] })
  findAll() { return this.<feature>Service.findAll(); }

  @Get(':id')
  @ApiOkResponse({ type: <Feature>Entity })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.<feature>Service.findOne(id); }

  @Post()
  @ApiCreatedResponse({ type: <Feature>Entity })
  create(@Body() dto: Create<Feature>Dto) { return this.<feature>Service.create(dto); }

  @Patch(':id')
  @ApiOkResponse({ type: <Feature>Entity })
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
