import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @Expose()
  accessToken: string;
}
