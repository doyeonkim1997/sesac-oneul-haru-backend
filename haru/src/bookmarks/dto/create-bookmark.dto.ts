import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ example: 1, description: '목표 ID' })
  @IsInt()
  goalId: number;

  @ApiProperty({ example: true, description: '북마크 여부' })
  @IsBoolean()
  isBookmarked: boolean;
}
