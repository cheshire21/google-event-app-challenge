import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FeedItemResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ enum: ['booking', 'google'] })
  type: 'booking' | 'google';

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
  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null;
}
