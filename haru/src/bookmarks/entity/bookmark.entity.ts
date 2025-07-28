import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';
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

  @ApiProperty({
    type: Boolean,
    description: '북마크 여부',
    example: true,
    required: true,
  })
  @IsBoolean()
  isBookmarked: boolean;
}
