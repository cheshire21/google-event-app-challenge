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
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
  // only add @Expose() to fields that should leave the service layer
}
```

### Service
```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@/shared/prisma/prisma.service';

const toDto = (data: unknown) =>
  plainToInstance(<Feature>ResponseDto, data, { excludeExtraneousValues: true });

@Injectable()
export class <Feature>Service {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return toDto(await this.prisma.<feature>.findMany());
  }

  async findOne(id: string) {
    const record = await this.prisma.<feature>.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`<Feature> ${id} not found`);
    return toDto(record);
  }

  async create(dto: Create<Feature>Dto) {
    return toDto(await this.prisma.<feature>.create({ data: dto }));
  }

  async update(id: string, dto: Update<Feature>Dto) {
    await this.findOne(id);
    return toDto(await this.prisma.<feature>.update({ where: { id }, data: dto }));
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
