import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { GiftResponseDto } from '../../gifts/dto/gift-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { RedemptionStatus } from '../entities/redemption.entity';

export class RedemptionResponseDto {
  @ApiProperty({ example: '8a9c2f6d-741a-42c2-8419-b2f778d91c10' })
  @Expose()
  id: string;

  @ApiProperty({ example: '8a9c2f6d-741a-42c2-8419-b2f778d91c10', nullable: true })
  @Expose()
  userId: string | null;

  @ApiProperty({ example: '8a9c2f6d-741a-42c2-8419-b2f778d91c10', nullable: true })
  @Expose()
  giftId: string | null;

  @ApiProperty({ example: 100 })
  @Expose()
  pointsUsed: number;

  @ApiProperty({ example: RedemptionStatus.COMPLETED, enum: RedemptionStatus })
  @Expose()
  status: RedemptionStatus;

  @ApiProperty({ type: () => UserResponseDto, nullable: true })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto | null;

  @ApiProperty({ type: () => GiftResponseDto, nullable: true })
  @Expose()
  @Type(() => GiftResponseDto)
  gift: GiftResponseDto | null;

  @ApiProperty({ example: '2026-07-10T02:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2026-07-10T02:00:00.000Z' })
  @Expose()
  updatedAt: Date;
}
