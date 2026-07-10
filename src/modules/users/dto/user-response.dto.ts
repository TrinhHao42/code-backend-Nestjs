import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '8a9c2f6d-741a-42c2-8419-b2f778d91c10' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @Expose()
  fullName: string;

  @ApiProperty({ example: '/uploads/avatars/avatar-12345678.png', nullable: true })
  @Expose()
  avatar: string | null;

  @ApiProperty({ example: 'user', enum: UserRole })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: 1000 })
  @Expose()
  points: number;

  @ApiProperty({ example: '2026-07-10T02:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2026-07-10T02:00:00.000Z' })
  @Expose()
  updatedAt: Date;
}
