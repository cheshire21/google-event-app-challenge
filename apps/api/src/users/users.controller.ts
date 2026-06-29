import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  getMe(@CurrentUser() currentUser: { userId: string }) {
    return this.usersService.findById(currentUser.userId);
  }

  @Patch('me')
  @ApiOkResponse({ type: UserResponseDto })
  updateMe(
    @CurrentUser() currentUser: { userId: string },
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(currentUser.userId, dto);
  }
}
