import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserFactory } from '@/test/factories/user.factory';
import type { PrismaMock } from '@/test/mocks/prisma.mock';
import { createPrismaMock } from '@/test/mocks/prisma.mock';
import { GoogleCalendarService } from './google-calendar.service';

// Mock googleapis — all fns defined inside the factory to avoid hoisting TDZ issues
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        generateAuthUrl: jest.fn(),
        getToken: jest.fn(),
        refreshAccessToken: jest.fn(),
        setCredentials: jest.fn(),
      })),
    },
    calendar: jest.fn().mockReturnValue({
      events: { list: jest.fn() },
    }),
  },
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const userFactory = new UserFactory();

describe('GoogleCalendarService', () => {
  let service: GoogleCalendarService;
  let prismaMock: PrismaMock;
  let user: User;
  let oauth2Instance: {
    generateAuthUrl: jest.Mock;
    getToken: jest.Mock;
    refreshAccessToken: jest.Mock;
    setCredentials: jest.Mock;
  };

  const mockConfigValues: Record<string, string> = {
    GOOGLE_CLIENT_ID: 'test-client-id',
    GOOGLE_CLIENT_SECRET: 'test-client-secret',
    GOOGLE_REDIRECT_URI: 'http://localhost:3001/api/google/callback',
    FRONTEND_URL: 'http://localhost:3000',
    JWT_SECRET: 'test-jwt-secret',
  };

  beforeEach(async () => {
    user = userFactory.make();
    prismaMock = createPrismaMock();

    // Create a fresh OAuth2 instance mock for each test
    oauth2Instance = {
      generateAuthUrl: jest.fn(),
      getToken: jest.fn(),
      refreshAccessToken: jest.fn(),
      setCredentials: jest.fn(),
    };
    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementation(
      () => oauth2Instance,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleCalendarService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              if (mockConfigValues[key] !== undefined)
                return mockConfigValues[key];
              throw new Error(`Unexpected config key: ${key}`);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleCalendarService>(GoogleCalendarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAuthUrl', () => {
    it('should return a URL containing the calendar.readonly scope and a state param', () => {
      const fakeState = 'signed-state-token';
      (jwt.sign as jest.Mock).mockReturnValue(fakeState);

      const fakeUrl =
        'https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&state=signed-state-token';
      oauth2Instance.generateAuthUrl.mockReturnValue(fakeUrl);

      const result = service.generateAuthUrl(user.id);

      expect(jwt.sign as jest.Mock).toHaveBeenCalledWith(
        { userId: user.id },
        'test-jwt-secret',
        { expiresIn: '10m' },
      );
      expect(oauth2Instance.generateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: ['https://www.googleapis.com/auth/calendar.readonly'],
          state: fakeState,
        }),
      );
      expect(result).toContain('calendar.readonly');
      expect(result).toContain('state=signed-state-token');
    });
  });

  describe('handleCallback', () => {
    it('should call prisma.user.update with hasGoogleCalendar true', async () => {
      const userId = user.id;
      (jwt.verify as jest.Mock).mockReturnValue({ userId });
      oauth2Instance.getToken.mockResolvedValue({
        tokens: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expiry_date: Date.now() + 3600 * 1000,
        },
      });
      prismaMock.user.update.mockResolvedValue({
        ...user,
        hasGoogleCalendar: true,
      });

      const redirectUrl = await service.handleCallback(
        'auth-code',
        'state-token',
      );

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          googleAccessToken: 'access-token',
          googleRefreshToken: 'refresh-token',
          googleTokenExpiry: expect.any(Date) as Date,
          hasGoogleCalendar: true,
        },
      });
      expect(redirectUrl).toBe('http://localhost:3000/calendar?connected=true');
    });
  });

  describe('getEvents', () => {
    it('should map Google Calendar events to CalendarEventDto array with type google', async () => {
      const startTime = '2026-06-30T08:00:00Z';
      const endTime = '2026-06-30T18:00:00Z';

      const connectedUser: User = {
        ...user,
        hasGoogleCalendar: true,
        googleAccessToken: 'access-token',
        googleRefreshToken: 'refresh-token',
        googleTokenExpiry: new Date(Date.now() + 3600 * 1000),
      };
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(connectedUser);

      const mockCalendar = {
        events: { list: jest.fn() },
      };
      (google.calendar as jest.Mock).mockReturnValue(mockCalendar);
      mockCalendar.events.list.mockResolvedValue({
        data: {
          items: [
            {
              id: faker.string.uuid(),
              summary: 'Team standup',
              start: { dateTime: startTime },
              end: { dateTime: endTime },
            },
          ],
        },
      });

      const result = await service.getEvents(user.id, startTime, endTime);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        title: 'Team standup',
        startTime,
        endTime,
        type: 'google',
      });
    });

    it('should throw BadRequestException when Google Calendar is not connected', async () => {
      const disconnectedUser: User = {
        ...user,
        hasGoogleCalendar: false,
        googleAccessToken: null,
      };
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(disconnectedUser);

      await expect(
        service.getEvents(
          user.id,
          '2026-06-30T08:00:00Z',
          '2026-06-30T18:00:00Z',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('disconnectCalendar', () => {
    it('should call prisma.user.update with null tokens and hasGoogleCalendar false', async () => {
      prismaMock.user.update.mockResolvedValue({
        ...user,
        hasGoogleCalendar: false,
      });

      await service.disconnectCalendar(user.id);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: {
          googleAccessToken: null,
          googleRefreshToken: null,
          googleTokenExpiry: null,
          hasGoogleCalendar: false,
        },
      });
    });
  });
});
