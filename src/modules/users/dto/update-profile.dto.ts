import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Họ và tên của người dùng',
    example: 'Nguyen Van A Updated',
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullName: string;
}
