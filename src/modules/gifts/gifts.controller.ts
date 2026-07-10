import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ErrorMessages } from '../../common/constants/error-messages.constant';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

import { CreateGiftDto } from './dto/create-gift.dto';
import { GiftResponseDto } from './dto/gift-response.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { GiftsService } from './gifts.service';

@ApiTags('Gifts')
@Controller('api/v1')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  // Các Api của user

  @Get('gifts')
  @ApiOperation({
    summary: 'Xem danh sách quà tặng khả dụng của hệ thống (User)',
  })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getGifts(@Query() query: PaginationQueryDto): Promise<{
    data: GiftResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { data, total } = await this.giftsService.findAllAvailable(query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    return {
      data: plainToInstance(GiftResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get('gifts/:id')
  @ApiOperation({ summary: 'Xem chi tiết một món quà (User)' })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết quà thành công' })
  @ApiResponse({
    status: 404,
    description: 'Quà không tồn tại hoặc không sẵn có',
  })
  async getGift(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        exceptionFactory: () => new NotFoundException(ErrorMessages.GIFT_NOT_FOUND_OR_HIDDEN),
      }),
    )
    id: string,
  ): Promise<GiftResponseDto> {
    const gift = await this.giftsService.findOne(id);
    if (!gift || !gift.isAvailable) {
      throw new NotFoundException(ErrorMessages.GIFT_NOT_FOUND_OR_HIDDEN);
    }
    return plainToInstance(GiftResponseDto, gift, {
      excludeExtraneousValues: true,
    });
  }

  // Các Api của admin

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/gifts')
  @ApiOperation({ summary: 'Tạo quà tặng mới (Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo quà thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền Admin' })
  async createGift(@Body() createGiftDto: CreateGiftDto): Promise<GiftResponseDto> {
    const gift = await this.giftsService.create(createGiftDto);
    return plainToInstance(GiftResponseDto, gift, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/gifts')
  @ApiOperation({ summary: 'Xem tất cả quà tặng (Admin)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getAllGiftsAdmin(@Query() query: PaginationQueryDto): Promise<{
    data: GiftResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { data, total } = await this.giftsService.findAll(query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    return {
      data: plainToInstance(GiftResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/gifts/:id')
  @ApiOperation({ summary: 'Xem chi tiết một món quà kể cả ẩn (Admin)' })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quà' })
  async getGiftAdmin(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        exceptionFactory: () => new NotFoundException(ErrorMessages.GIFT_NOT_FOUND),
      }),
    )
    id: string,
  ): Promise<GiftResponseDto> {
    const gift = await this.giftsService.findOne(id);
    if (!gift) {
      throw new NotFoundException(ErrorMessages.GIFT_NOT_FOUND);
    }
    return plainToInstance(GiftResponseDto, gift, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/gifts/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin quà tặng (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quà cần cập nhật' })
  async updateGift(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        exceptionFactory: () => new NotFoundException(ErrorMessages.GIFT_NOT_FOUND_TO_UPDATE),
      }),
    )
    id: string,
    @Body() updateGiftDto: UpdateGiftDto,
  ): Promise<GiftResponseDto> {
    const gift = await this.giftsService.update(id, updateGiftDto);
    if (!gift) {
      throw new NotFoundException(ErrorMessages.GIFT_NOT_FOUND_TO_UPDATE);
    }
    return plainToInstance(GiftResponseDto, gift, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/gifts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa quà tặng khỏi hệ thống (Admin)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quà cần xóa' })
  async deleteGift(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        exceptionFactory: () => new NotFoundException(ErrorMessages.GIFT_NOT_FOUND_TO_DELETE),
      }),
    )
    id: string,
  ): Promise<void> {
    const deleted = await this.giftsService.remove(id);
    if (!deleted) {
      throw new NotFoundException(ErrorMessages.GIFT_NOT_FOUND_TO_DELETE);
    }
  }
}
