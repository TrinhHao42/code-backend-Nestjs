import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateGiftDto {
  @ApiProperty({
    description: 'Tên quà tặng',
    example: 'Bình giữ nhiệt Lock&Lock',
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên quà không được để trống' })
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết quà tặng',
    example: 'Dung tích 500ml, giữ nhiệt 8 tiếng',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Số điểm cần đổi', example: 100 })
  @IsInt()
  @Min(0, { message: 'Điểm yêu cầu không được nhỏ hơn 0' })
  pointsRequired: number;

  @ApiProperty({ description: 'Số lượng trong kho', example: 50 })
  @IsInt()
  @Min(0, { message: 'Số lượng tồn kho không được nhỏ hơn 0' })
  stock: number;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
