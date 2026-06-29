# Error Handling

All errors go through `GlobalExceptionFilter` (`src/shared/filters/http-exception.filter.ts`), registered in `main.ts` via `app.useGlobalFilters()`.

## Response shape

```json
{
  "statusCode": 404,
  "message": "User not found",
  "timestamp": "2026-06-29T12:00:00.000Z"
}
```

## Throwing errors in services

Use NestJS built-in HTTP exceptions — never throw raw `Error`:

```ts
import { NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';

throw new NotFoundException('User not found');
throw new UnauthorizedException('Invalid token');
throw new BadRequestException('Email already in use');
```

- `400` — `BadRequestException` (invalid input that passed DTO validation)
- `401` — `UnauthorizedException` (missing or invalid auth)
- `403` — `ForbiddenException` (authenticated but not allowed)
- `404` — `NotFoundException` (resource doesn't exist)
- `409` — `ConflictException` (duplicate resource)
- `500` — anything not an `HttpException` (filter catches and wraps it)

## What not to do

- Don't catch-and-rethrow just to change the message — throw the right exception directly
- Don't return `{ error: '...' }` from controllers — throw and let the filter handle shape
- Don't expose internal error details (stack traces, DB errors) in the response message
