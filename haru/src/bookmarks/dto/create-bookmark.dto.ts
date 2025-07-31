import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ example: 1, description: '목표 ID' })
  @IsInt()
  goalId: number;
}
