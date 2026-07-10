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
import type { Request } from 'express';
import { diskStorage } from 'multer';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ensureDirExists, getUploadPath } from '../../common/utils/file-helper';

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
  async getProfile(@Req() req: Request): Promise<User | null> {
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
  ): Promise<User | null> {
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
          return cb(
            new BadRequestException('Chỉ cho phép tải lên các tệp hình ảnh (jpg, jpeg, png, gif)'),
            false,
          );
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
  ): Promise<User | null> {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp hình ảnh để tải lên');
    }
    const user = req.user as User;
    const avatarPath = getUploadPath(file.filename, 'avatars');
    return this.usersService.updateAvatar(user.id, avatarPath);
  }
}
