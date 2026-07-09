import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { Request } from 'express';
import { User } from './entities/user.entity';

@ApiTags('Users Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Lấy profile thành công' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  async getProfile(@Req() req: Request) {
    const user = req.user as User;
    return this.usersService.findOne(user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin profile' })
  @ApiResponse({ status: 200, description: 'Cập nhật profile thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu cập nhật không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = req.user as User;
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }
}
