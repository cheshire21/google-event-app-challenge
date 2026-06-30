import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client';
import { AbstractFactory } from './abstract.factory';

export class UserFactory extends AbstractFactory<User> {
  make(input?: Partial<User>): User {
    return {
      id: faker.string.uuid(),
      auth0Id: `auth0|${faker.string.alphanumeric(24)}`,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      googleAccessToken: null,
      googleRefreshToken: null,
      googleTokenExpiry: null,
      hasGoogleCalendar: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...input,
    };
  }
}
