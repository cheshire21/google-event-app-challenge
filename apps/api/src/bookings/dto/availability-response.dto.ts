import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ConflictItemResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  startTime: Date;

  @Expose()
  @ApiProperty()
  endTime: Date;

  @Expose()
  @ApiProperty({ enum: ['booking', 'google'] })
  type: 'booking' | 'google';
}

@Exclude()
export class AvailabilityResponseDto {
  @Expose()
  @ApiProperty()
  available: boolean;

  @Expose()
  @ApiProperty({ type: [ConflictItemResponseDto] })
  @Type(() => ConflictItemResponseDto)
  conflicts: ConflictItemResponseDto[];
}
