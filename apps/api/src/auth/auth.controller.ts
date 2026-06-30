import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
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

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Log out' })
  @ApiNoContentResponse({ description: 'Logged out successfully' })
  logout(@CurrentUser() user: { userId: string }): void {
    this.authService.logout(user.userId);
  }
}
