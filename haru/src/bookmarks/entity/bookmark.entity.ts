import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
export class BookmarkEntity {
  @ApiProperty({
    type: Number,
    description: '북마크 Id',
    example: 1,
    required: true,
  })
  @IsInt()
  bookmarkId: number;

  @ApiProperty({
    type: Number,
    description: '유저 Id',
    example: 1,
    required: true,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    type: Number,
    description: '목표 Id',
    example: 1,
    required: true,
  })
  @IsInt()
  goalId: number;
}
