# Prisma Conventions

## Schema

Single `prisma/schema.prisma` — all models in one file.

**Field order:** id → foreign keys → business fields → timestamps

```prisma
model Booking {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  startTime DateTime
  endTime   DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- All PKs: `String @id @default(uuid())`
- All models include `createdAt` and `updatedAt`
- Child relations use `onDelete: Cascade`

## Migrations

Names use snake_case feature descriptions:

```sh
prisma migrate dev --name init
prisma migrate dev --name add_google_calendar_fields
prisma migrate dev --name add_booking_conflict_index
```

## Commands

```sh
pnpm --filter=api prisma:migrate   # prisma migrate dev
pnpm --filter=api prisma:generate  # regenerate client after schema changes
pnpm --filter=api prisma:studio    # visual DB browser
```

Always run `prisma:generate` after schema changes before building.
