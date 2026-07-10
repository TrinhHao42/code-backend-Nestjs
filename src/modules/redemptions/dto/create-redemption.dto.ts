import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRedemptionDto {
  @ApiProperty({
    example: '8a9c2f6d-741a-42c2-8419-b2f778d91c10',
    description: 'ID của quà tặng cần đổi',
  })
  @IsUUID()
  @IsNotEmpty()
  giftId: string;
}
