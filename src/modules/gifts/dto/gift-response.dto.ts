import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GiftResponseDto {
  @ApiProperty({ example: '8a9c2f6d-741a-42c2-8419-b2f778d91c10' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Bình giữ nhiệt Lock&Lock' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Dung tích 500ml' })
  @Expose()
  description: string | null;

  @ApiProperty({ example: 100 })
  @Expose()
  pointsRequired: number;

  @ApiProperty({ example: 50 })
  @Expose()
  stock: number;

  @ApiProperty({ example: true })
  @Expose()
  isAvailable: boolean;

  @ApiProperty({ example: '2026-07-10T02:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2026-07-10T02:00:00.000Z' })
  @Expose()
  updatedAt: Date;
}
