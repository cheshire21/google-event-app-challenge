# NestJS Module Structure

All feature modules live under `src/modules/<name>/` with this layout:

```
src/modules/<name>/
├── <name>.module.ts
├── <name>.service.ts
├── <name>.controller.ts
├── dto/
│   ├── create-<name>.dto.ts
│   └── update-<name>.dto.ts
└── entities/
    └── <name>.entity.ts
```

- Always use the full subfolder structure — even for simple modules
- Import the module into `AppModule`
- `PrismaService` is available globally via `SharedModule` — do not re-import it

## DTOs

Use `class-validator` decorators only. The global `ValidationPipe` is configured with `{ whitelist: true, transform: true }`.

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

## Guards

All protected endpoints use `@UseGuards(JwtAuthGuard)`. Apply at controller level when all routes are protected, at method level for mixed controllers.

## Swagger

- Add `@ApiTags('name')` on every controller
- Add `@ApiBearerAuth()` on controllers/routes that require auth
- Add `@ApiProperty()` on all DTO and entity fields
