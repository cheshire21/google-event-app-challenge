import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ExchangeTokenDto } from './dto/exchange-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('exchange')
  @ApiOperation({ summary: 'Exchange Auth0 token for app JWT' })
  @ApiResponse({ status: 201, description: 'Returns app accessToken' })
  exchange(@Body() dto: ExchangeTokenDto) {
    return this.authService.exchangeToken(dto.auth0AccessToken);
  }
}
