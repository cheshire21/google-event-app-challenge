import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Booking } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { GoogleCalendarService } from '@/google-calendar/google-calendar.service';
import { BookingFactory } from '@/test/factories/booking.factory';
import { UserFactory } from '@/test/factories/user.factory';
import type { PrismaMock } from '@/test/mocks/prisma.mock';
import { createPrismaMock } from '@/test/mocks/prisma.mock';
import { AvailabilityService } from './availability.service';

const bookingFactory = new BookingFactory();
const userFactory = new UserFactory();

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let prismaMock: PrismaMock;
  let googleCalendarServiceMock: { getEvents: jest.Mock };
  let userId: string;

  beforeEach(async () => {
    const user = userFactory.make();
    userId = user.id;
    prismaMock = createPrismaMock();
    googleCalendarServiceMock = { getEvents: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: GoogleCalendarService, useValue: googleCalendarServiceMock },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAvailability', () => {
    it('should detect a full overlap', async () => {
      // existing [09:00–11:00], new [10:00–12:00] → available: false
      const existingBooking: Booking = bookingFactory.make({
        userId,
        startTime: new Date('2026-01-01T09:00:00.000Z'),
        endTime: new Date('2026-01-01T11:00:00.000Z'),
      });
      prismaMock.user.findUnique.mockResolvedValue({
        hasGoogleCalendar: false,
      });
      prismaMock.booking.findMany.mockResolvedValue([existingBooking]);

      const result = await service.checkAvailability(
        userId,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T12:00:00.000Z'),
      );

      expect(result.available).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].id).toBe(existingBooking.id);
      expect(result.conflicts[0].type).toBe('booking');
    });

    it('should detect a partial overlap', async () => {
      // existing [10:00–11:00], new [10:30–11:30] → available: false
      const existingBooking: Booking = bookingFactory.make({
        userId,
        startTime: new Date('2026-01-01T10:00:00.000Z'),
        endTime: new Date('2026-01-01T11:00:00.000Z'),
      });
      prismaMock.user.findUnique.mockResolvedValue({
        hasGoogleCalendar: false,
      });
      prismaMock.booking.findMany.mockResolvedValue([existingBooking]);

      const result = await service.checkAvailability(
        userId,
        new Date('2026-01-01T10:30:00.000Z'),
        new Date('2026-01-01T11:30:00.000Z'),
      );

      expect(result.available).toBe(false);
      expect(result.conflicts).toHaveLength(1);
    });

    it('should not flag adjacent bookings as a conflict', async () => {
      // existing [09:00–10:00], new [10:00–11:00] → available: true
      prismaMock.user.findUnique.mockResolvedValue({
        hasGoogleCalendar: false,
      });
      prismaMock.booking.findMany.mockResolvedValue([]);

      const result = await service.checkAvailability(
        userId,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T11:00:00.000Z'),
      );

      expect(result.available).toBe(true);
      expect(result.conflicts).toHaveLength(0);
      expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          startTime: { lt: new Date('2026-01-01T11:00:00.000Z') },
          endTime: { gt: new Date('2026-01-01T10:00:00.000Z') },
        },
      });
    });

    it('should exclude the specified booking id from conflict detection', async () => {
      // overlapping booking's id is passed as excludeBookingId → available: true
      const overlappingBooking: Booking = bookingFactory.make({
        userId,
        startTime: new Date('2026-01-01T09:00:00.000Z'),
        endTime: new Date('2026-01-01T11:00:00.000Z'),
      });
      prismaMock.user.findUnique.mockResolvedValue({
        hasGoogleCalendar: false,
      });
      prismaMock.booking.findMany.mockResolvedValue([]);

      const result = await service.checkAvailability(
        userId,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T12:00:00.000Z'),
        overlappingBooking.id,
      );

      expect(result.available).toBe(true);
      expect(result.conflicts).toHaveLength(0);
      expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          id: { not: overlappingBooking.id },
          startTime: { lt: new Date('2026-01-01T12:00:00.000Z') },
          endTime: { gt: new Date('2026-01-01T10:00:00.000Z') },
        },
      });
    });

    it('should not call googleCalendarService.getEvents when user has no Google Calendar', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        hasGoogleCalendar: false,
      });
      prismaMock.booking.findMany.mockResolvedValue([]);

      await service.checkAvailability(
        userId,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T11:00:00.000Z'),
      );

      expect(googleCalendarServiceMock.getEvents).not.toHaveBeenCalled();
    });

    it('should return available: true when user has Google Calendar but events do not overlap', async () => {
      // Google event [07:00–08:00] does not overlap with requested [10:00–11:00]
      prismaMock.user.findUnique.mockResolvedValue({ hasGoogleCalendar: true });
      prismaMock.booking.findMany.mockResolvedValue([]);
      googleCalendarServiceMock.getEvents.mockResolvedValue([
        {
          id: 'google-event-1',
          title: 'Early meeting',
          startTime: '2026-01-01T07:00:00.000Z',
          endTime: '2026-01-01T08:00:00.000Z',
          type: 'google',
        },
      ]);

      const result = await service.checkAvailability(
        userId,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T11:00:00.000Z'),
      );

      expect(result.available).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should return a Google Calendar conflict when event overlaps', async () => {
      // Google event [10:30–11:00] overlaps with requested [10:00–11:30]
      prismaMock.user.findUnique.mockResolvedValue({ hasGoogleCalendar: true });
      prismaMock.booking.findMany.mockResolvedValue([]);
      googleCalendarServiceMock.getEvents.mockResolvedValue([
        {
          id: 'google-event-1',
          title: 'Team standup',
          startTime: '2026-01-01T10:30:00.000Z',
          endTime: '2026-01-01T11:00:00.000Z',
          type: 'google',
        },
      ]);

      const result = await service.checkAvailability(
        userId,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T11:30:00.000Z'),
      );

      expect(result.available).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].id).toBe('google-event-1');
      expect(result.conflicts[0].type).toBe('google');
    });

    it('should return both booking and Google Calendar conflicts', async () => {
      const existingBooking: Booking = bookingFactory.make({
        userId,
        startTime: new Date('2026-01-01T09:00:00.000Z'),
        endTime: new Date('2026-01-01T10:30:00.000Z'),
      });
      prismaMock.user.findUnique.mockResolvedValue({ hasGoogleCalendar: true });
      prismaMock.booking.findMany.mockResolvedValue([existingBooking]);
      googleCalendarServiceMock.getEvents.mockResolvedValue([
        {
          id: 'google-event-1',
          title: 'Team standup',
          startTime: '2026-01-01T10:00:00.000Z',
          endTime: '2026-01-01T11:00:00.000Z',
          type: 'google',
        },
      ]);

      const result = await service.checkAvailability(
        userId,
        new Date('2026-01-01T09:30:00.000Z'),
        new Date('2026-01-01T10:30:00.000Z'),
      );

      expect(result.available).toBe(false);
      expect(result.conflicts).toHaveLength(2);
      const types = result.conflicts.map((c) => c.type);
      expect(types).toContain('booking');
      expect(types).toContain('google');
    });

    it('should fall back gracefully to booking conflicts when Google Calendar fetch fails', async () => {
      const existingBooking: Booking = bookingFactory.make({
        userId,
        startTime: new Date('2026-01-01T09:00:00.000Z'),
        endTime: new Date('2026-01-01T11:00:00.000Z'),
      });
      prismaMock.user.findUnique.mockResolvedValue({ hasGoogleCalendar: true });
      prismaMock.booking.findMany.mockResolvedValue([existingBooking]);
      googleCalendarServiceMock.getEvents.mockRejectedValue(
        new Error('Google API error'),
      );

      const result = await service.checkAvailability(
        userId,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T12:00:00.000Z'),
      );

      expect(result.available).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].type).toBe('booking');
    });
  });
});
