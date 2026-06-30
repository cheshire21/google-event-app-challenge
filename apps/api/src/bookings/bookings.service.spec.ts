import { NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Booking } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { GoogleCalendarService } from '@/google-calendar/google-calendar.service';
import type { PaginationQueryDto } from '@/shared/dto/pagination-query.dto';
import { BookingFactory } from '@/test/factories/booking.factory';
import { UserFactory } from '@/test/factories/user.factory';
import type { PrismaMock } from '@/test/mocks/prisma.mock';
import { createPrismaMock } from '@/test/mocks/prisma.mock';
import { BookingResponseDto } from './dto/booking-response.dto';
import { FeedItemResponseDto } from './dto/feed-item-response.dto';
import { BookingsService } from './bookings.service';

const bookingFactory = new BookingFactory();
const userFactory = new UserFactory();

describe('BookingsService', () => {
  let service: BookingsService;
  let prismaMock: PrismaMock;
  let googleCalendarServiceMock: { getEvents: jest.Mock };
  let userId: string;
  let booking: Booking;

  beforeEach(async () => {
    const user = userFactory.make();
    userId = user.id;
    booking = bookingFactory.make({ userId });
    prismaMock = createPrismaMock();
    googleCalendarServiceMock = { getEvents: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: GoogleCalendarService, useValue: googleCalendarServiceMock },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return only bookings belonging to the current user', async () => {
      const userBookings = bookingFactory.makeMany(3, { userId });
      prismaMock.booking.findMany.mockResolvedValue(userBookings);
      prismaMock.booking.count.mockResolvedValue(3);

      const query: PaginationQueryDto = { page: 1, limit: 20 };
      const result = await service.findAll(userId, query);

      expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 20,
        orderBy: { startTime: 'asc' },
      });
      expect(prismaMock.booking.count).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result.data).toHaveLength(3);
      expect(result.meta).toEqual({
        total: 3,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
      result.data.forEach((item) => {
        expect(item).toBeInstanceOf(BookingResponseDto);
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when booking not found', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(null);

      await expect(service.findOne('unknown-id', userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when booking belongs to a different user', async () => {
      const otherUserBooking = bookingFactory.make({
        userId: 'different-user-id',
      });
      prismaMock.booking.findUnique.mockResolvedValue(otherUserBooking);

      await expect(
        service.findOne(otherUserBooking.id, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return BookingResponseDto for the correct owner', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(booking);

      const result = await service.findOne(booking.id, userId);

      expect(result).toBeInstanceOf(BookingResponseDto);
      expect(result.id).toBe(booking.id);
      expect(result.title).toBe(booking.title);
      expect(
        (result as BookingResponseDto & { userId?: string }).userId,
      ).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should call prisma.booking.create with correct data and return BookingResponseDto', async () => {
      const dto = {
        title: booking.title,
        description: booking.description ?? undefined,
        startTime: booking.startTime,
        endTime: booking.endTime,
      };
      prismaMock.booking.create.mockResolvedValue(booking);

      const result = await service.create(userId, dto);

      expect(prismaMock.booking.create).toHaveBeenCalledWith({
        data: { ...dto, userId },
      });
      expect(result).toBeInstanceOf(BookingResponseDto);
      expect(result.title).toBe(booking.title);
    });
  });

  describe('update', () => {
    it('should verify ownership then update the booking', async () => {
      const updatedBooking: Booking = { ...booking, title: 'Updated Title' };
      prismaMock.booking.findUnique.mockResolvedValue(booking);
      prismaMock.booking.update.mockResolvedValue(updatedBooking);

      const dto = { title: 'Updated Title' };
      const result = await service.update(booking.id, userId, dto);

      expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
        where: { id: booking.id },
      });
      expect(prismaMock.booking.update).toHaveBeenCalledWith({
        where: { id: booking.id },
        data: dto,
      });
      expect(result).toBeInstanceOf(BookingResponseDto);
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('remove', () => {
    it('should verify ownership then delete the booking', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(booking);
      prismaMock.booking.delete.mockResolvedValue(booking);

      await service.remove(booking.id, userId);

      expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
        where: { id: booking.id },
      });
      expect(prismaMock.booking.delete).toHaveBeenCalledWith({
        where: { id: booking.id },
      });
    });
  });

  describe('getFeed', () => {
    it('should return only booking items when user has no Google Calendar', async () => {
      const bookings = bookingFactory.makeMany(2, { userId });
      prismaMock.booking.findMany.mockResolvedValue(bookings);
      prismaMock.user.findUnique.mockResolvedValue({
        hasGoogleCalendar: false,
      });

      const result = await service.getFeed(userId, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      result.data.forEach((item) => {
        expect(item).toBeInstanceOf(FeedItemResponseDto);
        expect(item.type).toBe('booking');
      });
      expect(googleCalendarServiceMock.getEvents).not.toHaveBeenCalled();
    });

    it('should merge and sort booking and Google events by startTime', async () => {
      const earlyBooking = bookingFactory.make({
        userId,
        startTime: new Date('2026-01-01T08:00:00.000Z'),
        endTime: new Date('2026-01-01T09:00:00.000Z'),
      });
      const lateBooking = bookingFactory.make({
        userId,
        startTime: new Date('2026-01-01T14:00:00.000Z'),
        endTime: new Date('2026-01-01T15:00:00.000Z'),
      });
      prismaMock.booking.findMany.mockResolvedValue([
        earlyBooking,
        lateBooking,
      ]);
      prismaMock.user.findUnique.mockResolvedValue({ hasGoogleCalendar: true });
      googleCalendarServiceMock.getEvents.mockResolvedValue([
        {
          id: 'google-1',
          title: 'Midday meeting',
          startTime: '2026-01-01T11:00:00.000Z',
          endTime: '2026-01-01T12:00:00.000Z',
          type: 'google',
        },
      ]);

      const result = await service.getFeed(userId, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(3);
      expect(result.data[0].type).toBe('booking');
      expect(result.data[0].startTime).toEqual(earlyBooking.startTime);
      expect(result.data[1].type).toBe('google');
      expect(result.data[1].id).toBe('google-1');
      expect(result.data[2].type).toBe('booking');
      expect(result.data[2].startTime).toEqual(lateBooking.startTime);
    });

    it('should apply pagination correctly', async () => {
      const bookings = bookingFactory.makeMany(5, { userId });
      prismaMock.booking.findMany.mockResolvedValue(bookings);
      prismaMock.user.findUnique.mockResolvedValue({
        hasGoogleCalendar: false,
      });

      const result = await service.getFeed(userId, { page: 2, limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(5);
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(2);
      expect(result.meta.totalPages).toBe(3);
    });

    it('should set description to null for Google events', async () => {
      prismaMock.booking.findMany.mockResolvedValue([]);
      prismaMock.user.findUnique.mockResolvedValue({ hasGoogleCalendar: true });
      googleCalendarServiceMock.getEvents.mockResolvedValue([
        {
          id: 'google-1',
          title: 'Some event',
          startTime: '2026-01-01T10:00:00.000Z',
          endTime: '2026-01-01T11:00:00.000Z',
          type: 'google',
        },
      ]);

      const result = await service.getFeed(userId, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].description).toBeNull();
    });

    it('should fall back gracefully when Google Calendar fetch fails', async () => {
      const bookings = bookingFactory.makeMany(1, { userId });
      prismaMock.booking.findMany.mockResolvedValue(bookings);
      prismaMock.user.findUnique.mockResolvedValue({ hasGoogleCalendar: true });
      googleCalendarServiceMock.getEvents.mockRejectedValue(
        new Error('Google API error'),
      );

      const result = await service.getFeed(userId, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].type).toBe('booking');
    });

    it('should pass startFrom and startTo as date range filters to prisma', async () => {
      prismaMock.booking.findMany.mockResolvedValue([]);
      prismaMock.user.findUnique.mockResolvedValue({
        hasGoogleCalendar: false,
      });

      await service.getFeed(userId, {
        page: 1,
        limit: 20,
        startFrom: '2026-01-01T00:00:00.000Z',
        startTo: '2026-01-31T23:59:59.000Z',
      });

      expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          endTime: { gte: new Date('2026-01-01T00:00:00.000Z') },
          startTime: { lte: new Date('2026-01-31T23:59:59.000Z') },
        },
        orderBy: { startTime: 'asc' },
      });
    });
  });
});
