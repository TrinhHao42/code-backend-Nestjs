import { join, extname } from 'path';

import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Request } from 'express';
import { diskStorage } from 'multer';

import { ErrorMessages } from '../../common/constants/error-messages.constant';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ensureDirExists, getUploadPath } from '../../common/utils/file-helper';

import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
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
  async getProfile(@Req() req: Request): Promise<UserResponseDto> {
    const user = req.user as User;
    const dbUser = await this.usersService.findOne(user.id);
    if (!dbUser) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    return plainToInstance(UserResponseDto, dbUser, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin profile' })
  @ApiResponse({ status: 200, description: 'Cập nhật profile thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu cập nhật không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = req.user as User;
    const dbUser = await this.usersService.updateProfile(user.id, updateProfileDto);
    if (!dbUser) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    return plainToInstance(UserResponseDto, dbUser, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @ApiResponse({ status: 200, description: 'Thay đổi mật khẩu thành công' })
  @ApiResponse({
    status: 400,
    description: 'Mật khẩu cũ không chính xác hoặc dữ liệu không hợp lệ',
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = req.user as User;
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Post('upload/avatar')
  @ApiOperation({ summary: 'Tải lên hình đại diện (Avatar)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh avatar (jpg, jpeg, png, gif), tối đa 2MB',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tải lên thành công, trả về profile đã cập nhật' })
  @ApiResponse({ status: 400, description: 'File không hợp lệ hoặc kích thước quá lớn' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = join(__dirname, '..', '..', '..', 'public', 'uploads', 'avatars');
          ensureDirExists(uploadDir);
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new BadRequestException(ErrorMessages.INVALID_IMAGE_TYPE), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async uploadAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserResponseDto> {
    if (!file) {
      throw new BadRequestException(ErrorMessages.NO_FILE_UPLOADED);
    }
    const user = req.user as User;
    const avatarPath = getUploadPath(file.filename, 'avatars');
    const dbUser = await this.usersService.updateAvatar(user.id, avatarPath);
    if (!dbUser) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    return plainToInstance(UserResponseDto, dbUser, {
      excludeExtraneousValues: true,
    });
  }
}
