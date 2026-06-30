import { IsISO8601, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@/shared/dto/pagination-query.dto';

export class FeedQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  startFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  startTo?: string;
}
