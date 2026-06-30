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
  Query,
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
import { AvailabilityService } from './availability.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { PaginatedBookingResponseDto } from './dto/paginated-booking-response.dto';
import { BookingRangeQueryDto } from './dto/booking-range-query.dto';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { AvailabilityResponseDto } from './dto/availability-response.dto';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Get()
  @ApiOkResponse({ type: PaginatedBookingResponseDto })
  findAll(
    @CurrentUser() currentUser: { userId: string },
    @Query() query: BookingRangeQueryDto,
  ) {
    return this.bookingsService.findAll(currentUser.userId, query);
  }

  @Get('availability')
  @ApiOkResponse({ type: AvailabilityResponseDto })
  async checkAvailability(
    @CurrentUser() currentUser: { userId: string },
    @Query() query: AvailabilityQueryDto,
  ): Promise<AvailabilityResponseDto> {
    return this.availabilityService.checkAvailability(
      currentUser.userId,
      new Date(query.start),
      new Date(query.end),
      query.excludeId,
    );
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
