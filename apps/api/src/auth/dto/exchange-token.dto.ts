import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExchangeTokenDto {
  @ApiProperty({ description: 'Auth0 access token' })
  @IsString()
  @IsNotEmpty()
  auth0AccessToken: string;
}
