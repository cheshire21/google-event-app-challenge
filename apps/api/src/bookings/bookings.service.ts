import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { GoogleCalendarService } from '@/google-calendar/google-calendar.service';
import { PaginatedBookingResponseDto } from './dto/paginated-booking-response.dto';
import { PaginatedFeedResponseDto } from './dto/paginated-feed-response.dto';
import { BookingRangeQueryDto } from './dto/booking-range-query.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async findAll(
    userId: string,
    { page, limit, startFrom, startTo }: BookingRangeQueryDto,
  ): Promise<PaginatedBookingResponseDto> {
    const where = {
      userId,
      ...(startFrom || startTo
        ? {
            startTime: {
              ...(startFrom ? { gte: new Date(startFrom) } : {}),
              ...(startTo ? { lte: new Date(startTo) } : {}),
            },
          }
        : {}),
    };
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startTime: 'asc' },
      }),
      this.prisma.booking.count({ where }),
    ]);
    return plainToInstance(
      PaginatedBookingResponseDto,
      {
        data: bookings,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { excludeExtraneousValues: true },
    );
  }

  async findOne(id: string, userId: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.userId !== userId) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    return plainToInstance(BookingResponseDto, booking, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.create({
      data: { ...dto, userId },
    });
    return plainToInstance(BookingResponseDto, booking, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateBookingDto,
  ): Promise<BookingResponseDto> {
    await this.findOne(id, userId);
    const booking = await this.prisma.booking.update({
      where: { id },
      data: dto,
    });
    return plainToInstance(BookingResponseDto, booking, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.prisma.booking.delete({ where: { id } });
  }

  async getFeed(
    userId: string,
    { page, limit, startFrom, startTo }: FeedQueryDto,
  ): Promise<PaginatedFeedResponseDto> {
    const where = {
      userId,
      ...(startFrom ? { endTime: { gte: new Date(startFrom) } } : {}),
      ...(startTo ? { startTime: { lte: new Date(startTo) } } : {}),
    };

    const bookings = await this.prisma.booking.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { hasGoogleCalendar: true },
    });

    const bookingItems = bookings.map((b) => ({
      id: b.id,
      type: 'booking' as const,
      title: b.title,
      startTime: b.startTime,
      endTime: b.endTime,
      description: b.description,
    }));

    let googleItems: Array<{
      id: string;
      type: 'google';
      title: string;
      startTime: Date;
      endTime: Date;
      description: null;
    }> = [];

    if (user?.hasGoogleCalendar) {
      try {
        const events = await this.googleCalendarService.getEvents(
          userId,
          startFrom ?? new Date(0).toISOString(),
          startTo ?? new Date('2099').toISOString(),
        );
        googleItems = events.map((e) => ({
          id: e.id,
          type: 'google' as const,
          title: e.title,
          startTime: new Date(e.startTime),
          endTime: new Date(e.endTime),
          description: null,
        }));
      } catch (err) {
        this.logger.error(
          'Failed to fetch Google Calendar events for feed',
          err,
        );
      }
    }

    const toDateOnly = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    const merged = [...bookingItems, ...googleItems].sort((a, b) => {
      const dayDiff = toDateOnly(a.startTime) - toDateOnly(b.startTime);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.getTime() - b.startTime.getTime();
    });

    const total = merged.length;
    const data = merged.slice((page - 1) * limit, page * limit);

    return plainToInstance(
      PaginatedFeedResponseDto,
      {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { excludeExtraneousValues: true },
    );
  }
}
