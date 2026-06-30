import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PagedResponseDto } from '@/shared/dto/paged-response.dto';
import { BookingResponseDto } from './booking-response.dto';

export class PaginatedBookingResponseDto extends PagedResponseDto<BookingResponseDto> {
  @Expose()
  @ApiProperty({ type: [BookingResponseDto] })
  @Type(() => BookingResponseDto)
  data: BookingResponseDto[];
}
