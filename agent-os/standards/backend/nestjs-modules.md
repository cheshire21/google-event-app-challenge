# NestJS Module Structure

All feature modules live under `src/<name>/` with this layout:

```
src/<name>/
├── <name>.module.ts
├── <name>.service.ts
├── <name>.controller.ts
└── dto/
    ├── create-<name>.dto.ts      — input: class-validator decorators
    ├── update-<name>.dto.ts      — input: PartialType(CreateDto)
    └── <name>-response.dto.ts    — output: @Exclude() + @Expose() + @ApiProperty()
```

- Always use the full subfolder structure — even for simple modules
- Import the module into `AppModule`
- `PrismaService` is available globally via `SharedModule` — do not re-import it

## DTOs

Every feature has two DTO categories in `dto/`:

### Input DTOs — request validation

Use `class-validator` decorators. The global `ValidationPipe` is configured with `{ whitelist: true, transform: true }`.

```ts
export class CreateBookingDto {
  @IsString() 
  @IsNotEmpty() 
  title: string;
  @IsDateString() 
  startTime: string;
  @IsDateString() 
  endTime: string;
}
```

- `whitelist: true` strips unknown fields automatically
- `transform: true` coerces types (e.g. string → Date)
- Use `PartialType(CreateXDto)` for update DTOs

### Output DTOs — response shape

Use `class-transformer` `@Exclude()` + `@Expose()`. Services return these via `plainToInstance`.

```ts
@Exclude()
export class BookingResponseDto {
  @Expose()
  @ApiProperty()
  id: string;
  
  @Expose()
  @ApiProperty()
  title: string;
  
  @Expose()
  @ApiProperty()
  startTime: Date;
  
  @Expose()
  @ApiProperty()
  endTime: Date;
  
  // sensitive/internal fields omitted — not decorated with @Expose()
}
```

Services always wrap Prisma results:

```ts
return plainToInstance(BookingResponseDto, prismaResult, { excludeExtraneousValues: true });
```

- `excludeExtraneousValues: true` ensures only `@Expose()` fields appear in the response
- Never return raw Prisma objects from a service — always `plainToInstance`
- Controllers use the response DTO for `@ApiOkResponse({ type: XResponseDto })`

## Guards

All protected endpoints use `@UseGuards(JwtAuthGuard)`. Apply at controller level when all routes are protected, at method level for mixed controllers.

## Swagger

- Add `@ApiTags('name')` on every controller
- Add `@ApiBearerAuth()` on controllers/routes that require auth
- Add `@ApiProperty()` on all DTO and entity fields
