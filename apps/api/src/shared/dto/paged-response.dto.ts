import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PageMeta {
  @Expose()
  @ApiProperty()
  total: number;

  @Expose()
  @ApiProperty()
  page: number;

  @Expose()
  @ApiProperty()
  limit: number;

  @Expose()
  @ApiProperty()
  totalPages: number;
}

@Exclude()
export class PagedResponseDto<T> {
  @Expose()
  @ApiProperty({ isArray: true })
  data: T[];

  @Expose()
  @ApiProperty({ type: () => PageMeta })
  meta: PageMeta;
}
