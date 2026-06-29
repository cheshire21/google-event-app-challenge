# Unit Testing Conventions

## Prisma Mock

`src/test/mocks/prisma.mock.ts` — update `createPrismaMock()` whenever a new model is added to `schema.prisma`:

```ts
export const createPrismaMock = (): jest.Mocked<Partial<PrismaService>> => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
  user: mockModel(),
  booking: mockModel(),
});
```

- Add a `mockModel()` entry for every Prisma model, keyed by camelCase model name
- `mockModel()` provides jest.fn() stubs for all standard Prisma operations

## Factories

Create factories in `src/test/factories/` only when a test file needs them (not upfront).

Extend `AbstractFactory<T>` and import the Prisma type:

```ts
import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { AbstractFactory } from './abstract.factory';

export class UserFactory extends AbstractFactory<User> {
  make(input?: Partial<User>): User {
    return {
      id: faker.string.uuid(),
      auth0Id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...input,
    };
  }
}
```

- `makeMany(count, input?)` is inherited from `AbstractFactory`
- Override specific fields via the `input` partial

## Service Test Pattern

```ts
let service: BookingsService;
let prisma: PrismaMock;

beforeEach(async () => {
  prisma = createPrismaMock();
  const module = await Test.createTestingModule({
    providers: [
      BookingsService,
      { provide: PrismaService, useValue: prisma },
    ],
  }).compile();
  service = module.get(BookingsService);
});
```
