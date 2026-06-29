import type { PrismaService } from '../../shared/prisma/prisma.service';

const _mockModel = () => ({
  findMany: jest.fn(),
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
});

/**
 * Add a mockModel() entry for each model in prisma/schema.prisma.
 * Example:
 *   user: mockModel(),
 *   event: mockModel(),
 */
export const createPrismaMock = (): jest.Mocked<Partial<PrismaService>> => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
  // user: mockModel(),
  // event: mockModel(),
});

export type PrismaMock = ReturnType<typeof createPrismaMock>;
