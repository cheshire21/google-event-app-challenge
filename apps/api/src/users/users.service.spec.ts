import { NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { User } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserFactory } from '@/test/factories/user.factory';
import type { PrismaMock } from '@/test/mocks/prisma.mock';
import { createPrismaMock } from '@/test/mocks/prisma.mock';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

const userFactory = new UserFactory();

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: PrismaMock;
  let user: User;

  beforeEach(async () => {
    user = userFactory.make();
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should throw NotFoundException when user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return UserResponseDto without auth0Id', async () => {
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await service.findById(user.id);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
      expect(
        (result as UserResponseDto & { auth0Id?: string }).auth0Id,
      ).toBeUndefined();
    });
  });

  describe('updateProfile', () => {
    it('should call prisma.user.update with correct args and return UserResponseDto', async () => {
      const updatedUser: User = { ...user, name: 'Updated Name' };
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const dto = { name: 'Updated Name' };
      const result = await service.updateProfile(user.id, dto);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: dto,
      });
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.name).toBe('Updated Name');
    });
  });
});
