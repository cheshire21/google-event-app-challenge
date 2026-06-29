import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<BookingResponseDto[]> {
    const bookings = await this.prisma.booking.findMany({ where: { userId } });
    return plainToInstance(BookingResponseDto, bookings, {
      excludeExtraneousValues: true,
    });
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
