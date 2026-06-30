import { ApiProperty } from '@nestjs/swagger';

export class CalendarEventDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ enum: ['google'] })
  type: 'google';
}
