import { NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Booking } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { BookingFactory } from '@/test/factories/booking.factory';
import { UserFactory } from '@/test/factories/user.factory';
import type { PrismaMock } from '@/test/mocks/prisma.mock';
import { createPrismaMock } from '@/test/mocks/prisma.mock';
import { BookingResponseDto } from './dto/booking-response.dto';
import { BookingsService } from './bookings.service';

const bookingFactory = new BookingFactory();
const userFactory = new UserFactory();

describe('BookingsService', () => {
  let service: BookingsService;
  let prismaMock: PrismaMock;
  let userId: string;
  let booking: Booking;

  beforeEach(async () => {
    const user = userFactory.make();
    userId = user.id;
    booking = bookingFactory.make({ userId });
    prismaMock = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: prismaMock },
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

      const result = await service.findAll(userId);

      expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toHaveLength(3);
      result.forEach((item) => {
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
});
