import { ApiProperty } from '@nestjs/swagger';

class GoalDto {
  @ApiProperty({ example: '하루 10분 독서', description: '목표 내용' })
  content: string;

  @ApiProperty({ example: '자기계발', description: '카테고리' })
  category: string;

  @ApiProperty({ example: false, description: '완료 여부' })
  isCompleted: boolean;
}

export class BookmarkResponseDto {
  @ApiProperty({ example: 1, description: '북마크 ID' })
  bookmarkId: number;

  @ApiProperty({ example: 1, description: '유저 ID' })
  userId: number;

  @ApiProperty({ example: 1, description: '목표 ID' })
  goalId: number;

  @ApiProperty({ type: GoalDto, description: '북마크된 목표 정보' })
  goal: GoalDto;
}
