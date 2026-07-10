import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { UserResponseDto } from '../users/dto/user-response.dto';

import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản người dùng mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.authService.register(registerDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Post('admin/register')
  @ApiOperation({ summary: 'Đăng ký tài khoản Admin mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký Admin thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  async registerAdmin(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.authService.registerAdmin(registerDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập dành cho người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công, trả về Access Token',
  })
  @ApiResponse({
    status: 400,
    description: 'Email hoặc mật khẩu không chính xác',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    return plainToInstance(AuthResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập dành cho Admin' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công, trả về Access Token',
  })
  @ApiResponse({
    status: 400,
    description: 'Email hoặc mật khẩu không chính xác',
  })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto): Promise<AuthResponseDto> {
    const result = await this.authService.adminLogin(adminLoginDto);
    return plainToInstance(AuthResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
