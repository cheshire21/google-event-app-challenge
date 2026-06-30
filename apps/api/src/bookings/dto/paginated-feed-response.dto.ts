import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PagedResponseDto } from '@/shared/dto/paged-response.dto';
import { FeedItemResponseDto } from './feed-item-response.dto';

export class PaginatedFeedResponseDto extends PagedResponseDto<FeedItemResponseDto> {
  @Expose()
  @ApiProperty({ type: [FeedItemResponseDto] })
  @Type(() => FeedItemResponseDto)
  declare data: FeedItemResponseDto[];
}
