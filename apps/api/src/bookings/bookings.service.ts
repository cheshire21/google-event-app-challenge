import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { PaginationQueryDto } from '@/shared/dto/pagination-query.dto';
import { PaginatedBookingResponseDto } from './dto/paginated-booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    { page, limit }: PaginationQueryDto,
  ): Promise<PaginatedBookingResponseDto> {
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startTime: 'asc' },
      }),
      this.prisma.booking.count({ where: { userId } }),
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
}
