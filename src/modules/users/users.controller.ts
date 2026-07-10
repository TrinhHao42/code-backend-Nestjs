import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

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
  async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const user = req.user as User;
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @ApiResponse({ status: 200, description: 'Thay đổi mật khẩu thành công' })
  @ApiResponse({
    status: 400,
    description: 'Mật khẩu cũ không chính xác hoặc dữ liệu không hợp lệ',
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  async changePassword(@Req() req: Request, @Body() changePasswordDto: ChangePasswordDto) {
    const user = req.user as User;
    return this.usersService.changePassword(user.id, changePasswordDto);
  }
}
