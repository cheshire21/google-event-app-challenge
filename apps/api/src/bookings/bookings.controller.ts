import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOkResponse({ type: [BookingResponseDto] })
  findAll(@CurrentUser() currentUser: { userId: string }) {
    return this.bookingsService.findAll(currentUser.userId);
  }

  @Get(':id')
  @ApiOkResponse({ type: BookingResponseDto })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: { userId: string },
  ) {
    return this.bookingsService.findOne(id, currentUser.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: BookingResponseDto })
  create(
    @CurrentUser() currentUser: { userId: string },
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(currentUser.userId, dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: BookingResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: { userId: string },
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, currentUser.userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: { userId: string },
  ) {
    return this.bookingsService.remove(id, currentUser.userId);
  }
}
