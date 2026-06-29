import { faker } from '@faker-js/faker';
import type { Booking } from '@prisma/client';
import { AbstractFactory } from './abstract.factory';

export class BookingFactory extends AbstractFactory<Booking> {
  make(input?: Partial<Booking>): Booking {
    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      startTime: faker.date.soon(),
      endTime: faker.date.soon({ days: 1 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...input,
    };
  }
}
