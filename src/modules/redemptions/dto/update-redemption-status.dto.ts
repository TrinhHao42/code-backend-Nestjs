import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { RedemptionStatus } from '../entities/redemption.entity';

export class UpdateRedemptionStatusDto {
  @ApiProperty({
    example: RedemptionStatus.CANCELLED,
    enum: RedemptionStatus,
    description: 'Trạng thái mới của giao dịch đổi quà',
  })
  @IsEnum(RedemptionStatus)
  @IsNotEmpty()
  status: RedemptionStatus;
}
