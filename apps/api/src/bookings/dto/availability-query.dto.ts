import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class AvailabilityQueryDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsUUID()
  @IsOptional()
  excludeId?: string;
}
