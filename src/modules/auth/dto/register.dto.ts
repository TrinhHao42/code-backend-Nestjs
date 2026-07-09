import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ description: 'Mật khẩu', example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @ApiProperty({
    description: 'Họ và tên của người dùng',
    example: 'Nguyen Van A',
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullName: string;
}
