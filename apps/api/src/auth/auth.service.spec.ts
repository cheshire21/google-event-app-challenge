import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as jose from 'jose';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserFactory } from '@/test/factories/user.factory';
import type { PrismaMock } from '@/test/mocks/prisma.mock';
import { createPrismaMock } from '@/test/mocks/prisma.mock';
import { AuthService } from './auth.service';

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const userFactory = new UserFactory();

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: PrismaMock;
  let mockSign: jest.Mock;
  let mockUpsert: jest.Mock;
  let user: User;

  const auth0Domain = 'test.auth0.com';
  const auth0Audience = 'https://api.test.com';
  const auth0AccessToken = 'auth0-access-token';

  beforeEach(async () => {
    user = userFactory.make();

    prismaMock = createPrismaMock();
    mockSign = jest.fn().mockReturnValue('signed-token');
    mockUpsert = prismaMock.user.upsert;

    const jwtService = { sign: mockSign };
    const configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'AUTH0_DOMAIN') return auth0Domain;
        if (key === 'AUTH0_AUDIENCE') return auth0Audience;
        if (key === 'JWT_SECRET') return 'test-secret';
        throw new Error(`Unexpected key: ${key}`);
      }),
    };

    (jose.createRemoteJWKSet as jest.Mock).mockReturnValue('mock-jwks');
    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { sub: user.auth0Id },
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        email: user.email,
        name: user.name,
        sub: user.auth0Id,
      }),
    });

    mockUpsert.mockResolvedValue(user);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('exchangeToken', () => {
    it('should upsert user with correct data from Auth0', async () => {
      await service.exchangeToken(auth0AccessToken);

      expect(mockUpsert).toHaveBeenCalledWith({
        where: { auth0Id: user.auth0Id },
        create: { auth0Id: user.auth0Id, email: user.email, name: user.name },
        update: { email: user.email, name: user.name },
      });
    });

    it('should return an accessToken signed with jwtService', async () => {
      const result = await service.exchangeToken(auth0AccessToken);

      expect(mockSign).toHaveBeenCalledWith({ sub: user.id });
      expect(result).toEqual({ accessToken: 'signed-token' });
    });

    it('should throw UnauthorizedException when token verification fails', async () => {
      (jose.jwtVerify as jest.Mock).mockRejectedValue(
        new Error('Invalid token'),
      );

      await expect(service.exchangeToken(auth0AccessToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when userinfo fetch fails', async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(service.exchangeToken(auth0AccessToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
