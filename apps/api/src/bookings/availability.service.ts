import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { AvailabilityResponseDto } from './dto/availability-response.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAvailability(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string,
  ): Promise<AvailabilityResponseDto> {
    const overlapping = await this.prisma.booking.findMany({
      where: {
        userId,
        ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    return plainToInstance(
      AvailabilityResponseDto,
      {
        available: overlapping.length === 0,
        conflicts: overlapping.map((b) => ({
          id: b.id,
          title: b.title,
          startTime: b.startTime,
          endTime: b.endTime,
          type: 'booking' as const,
        })),
      },
      { excludeExtraneousValues: true },
    );
  }
}
