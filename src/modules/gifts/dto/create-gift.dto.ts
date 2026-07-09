import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateGiftDto {
  @ApiProperty({
    description: 'Tên quà tặng (tối thiểu 3 ký tự)',
    example: 'Bình giữ nhiệt Lock&Lock',
  })
  @IsString({ message: 'Tên quà phải là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên quà không được để trống' })
  @MinLength(3, { message: 'Tên quà phải có ít nhất 3 ký tự trở lên' })
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết quà tặng',
    example: 'Dung tích 500ml, giữ nhiệt 8 tiếng',
  })
  @IsString({ message: 'Mô tả phải là một chuỗi ký tự' })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Số điểm cần đổi (tối thiểu 1)', example: 100 })
  @IsInt({ message: 'Số điểm cần đổi phải là số nguyên' })
  @Min(1, { message: 'Điểm yêu cầu phải có ít nhất là 1' })
  pointsRequired: number;

  @ApiProperty({ description: 'Số lượng trong kho (tối thiểu 1)', example: 50 })
  @IsInt({ message: 'Số lượng trong kho phải là số nguyên' })
  @Min(1, { message: 'Số lượng trong kho phải có ít nhất là 1' })
  stock: number;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là kiểu boolean' })
  @IsOptional()
  isAvailable?: boolean;
}
