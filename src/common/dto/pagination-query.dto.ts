import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Trang cần lấy (bắt đầu từ 1)',
    default: 1,
  })
  @IsInt({ message: 'Trang phải là một số nguyên' })
  @Min(1, { message: 'Trang tối thiểu là 1' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi tối đa trên một trang',
    default: 10,
  })
  @IsInt({ message: 'Số lượng giới hạn phải là một số nguyên' })
  @Min(1, { message: 'Giới hạn tối thiểu là 1' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
