import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Req,
  Query,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Request } from 'express';

import { ErrorMessages } from '../../common/constants/error-messages.constant';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User, UserRole } from '../users/entities/user.entity';

import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { RedemptionResponseDto } from './dto/redemption-response.dto';
import { UpdateRedemptionStatusDto } from './dto/update-redemption-status.dto';
import { RedemptionsService } from './redemptions.service';

@ApiTags('Redemptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1')
export class RedemptionsController {
  constructor(private readonly redemptionsService: RedemptionsService) {}

  @Post('redemptions')
  @ApiOperation({ summary: 'Người dùng thực hiện đổi quà tặng' })
  @ApiResponse({ status: 201, description: 'Đổi quà thành công', type: RedemptionResponseDto })
  @ApiResponse({ status: 400, description: 'Hết hàng hoặc không đủ điểm' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async redeemGift(
    @Req() req: Request,
    @Body() createRedemptionDto: CreateRedemptionDto,
  ): Promise<RedemptionResponseDto> {
    const user = req.user as User;
    const redemption = await this.redemptionsService.redeemGift(
      user.id,
      createRedemptionDto.giftId,
    );
    return plainToInstance(RedemptionResponseDto, redemption, {
      excludeExtraneousValues: true,
    });
  }

  @Get('redemptions')
  @ApiOperation({ summary: 'Xem lịch sử đổi quà của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getMyRedemptions(
    @Req() req: Request,
    @Query() query: PaginationQueryDto,
  ): Promise<{
    data: RedemptionResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const user = req.user as User;
    const { data, total } = await this.redemptionsService.findAllForUser(user.id, query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    return {
      data: plainToInstance(RedemptionResponseDto, data, {
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

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/redemptions')
  @ApiOperation({ summary: 'Admin xem tất cả lịch sử giao dịch đổi quà' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 403, description: 'Không có quyền Admin' })
  async getAllRedemptionsAdmin(@Query() query: PaginationQueryDto): Promise<{
    data: RedemptionResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { data, total } = await this.redemptionsService.findAllAdmin(query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    return {
      data: plainToInstance(RedemptionResponseDto, data, {
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

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/redemptions/:id/status')
  @ApiOperation({ summary: 'Admin cập nhật trạng thái đơn đổi quà (ví dụ hủy đơn)' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái thành công',
    type: RedemptionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy giao dịch' })
  @ApiResponse({ status: 403, description: 'Không có quyền Admin' })
  async updateStatus(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
        exceptionFactory: () => new NotFoundException(ErrorMessages.REDEMPTION_NOT_FOUND),
      }),
    )
    id: string,
    @Body() updateRedemptionStatusDto: UpdateRedemptionStatusDto,
  ): Promise<RedemptionResponseDto> {
    const redemption = await this.redemptionsService.updateStatus(
      id,
      updateRedemptionStatusDto.status,
    );
    return plainToInstance(RedemptionResponseDto, redemption, {
      excludeExtraneousValues: true,
    });
  }
}
