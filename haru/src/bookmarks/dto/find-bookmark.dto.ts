import { ApiProperty } from '@nestjs/swagger';

export class FindBookmarkDto {
  @ApiProperty({ example: 1, description: '북마크 ID' })
  bookmarkId: number;

  @ApiProperty({ example: 1, description: '유저 ID' })
  userId: number;

  @ApiProperty({ example: 1, description: '목표 ID' })
  goalId: number;

  @ApiProperty({ example: true, description: '북마크 여부' })
  isBookmarked: boolean;
}
