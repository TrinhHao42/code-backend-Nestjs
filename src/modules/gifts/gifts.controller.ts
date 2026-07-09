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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

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
  async getGifts() {
    return this.giftsService.findAllAvailable();
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
        exceptionFactory: () =>
          new NotFoundException(
            'Không tìm thấy quà tặng phù hợp hoặc quà đã bị ẩn',
          ),
      }),
    )
    id: string,
  ) {
    const gift = await this.giftsService.findOne(id);
    if (!gift || !gift.isAvailable) {
      throw new NotFoundException(
        'Không tìm thấy quà tặng phù hợp hoặc quà đã bị ẩn',
      );
    }
    return gift;
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
  async createGift(@Body() createGiftDto: CreateGiftDto) {
    return this.giftsService.create(createGiftDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/gifts')
  @ApiOperation({ summary: 'Xem tất cả quà tặng (Admin)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getAllGiftsAdmin() {
    return this.giftsService.findAll();
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
        exceptionFactory: () =>
          new NotFoundException('Không tìm thấy quà tặng'),
      }),
    )
    id: string,
  ) {
    const gift = await this.giftsService.findOne(id);
    if (!gift) {
      throw new NotFoundException('Không tìm thấy quà tặng');
    }
    return gift;
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
        exceptionFactory: () =>
          new NotFoundException('Không tìm thấy quà tặng để cập nhật'),
      }),
    )
    id: string,
    @Body() updateGiftDto: UpdateGiftDto,
  ) {
    const gift = await this.giftsService.update(id, updateGiftDto);
    if (!gift) {
      throw new NotFoundException('Không tìm thấy quà tặng để cập nhật');
    }
    return gift;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/gifts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa quà tặng khỏi hệ thống (Admin)' })
  @ApiResponse({ status: 24, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quà cần xóa' })
  async deleteGift(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        exceptionFactory: () =>
          new NotFoundException('Không tìm thấy quà tặng để xóa'),
      }),
    )
    id: string,
  ) {
    const deleted = await this.giftsService.remove(id);
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy quà tặng để xóa');
    }
  }
}
