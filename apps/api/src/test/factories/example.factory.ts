import { faker } from '@faker-js/faker';
import { AbstractFactory } from './abstract.factory';

/**
 * Example factory — copy this pattern for each Prisma model.
 * Replace ExampleModel with your actual Prisma type (e.g. import { User } from '@prisma/client').
 */
type ExampleModel = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ExampleFactory extends AbstractFactory<ExampleModel> {
  make(input?: Partial<ExampleModel>): ExampleModel {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...input,
    };
  }
}
