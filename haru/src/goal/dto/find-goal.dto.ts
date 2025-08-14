import { ApiProperty } from '@nestjs/swagger';

export class FindGoalDto {
  @ApiProperty({
    type: Number,
    description: '목표 Id',
    example: 1,
    required: true,
  })
  goalId: number;

  @ApiProperty({
    type: Number,
    description: '유저id',
    example: 1,
    required: true,
  })
  userId: number;

  @ApiProperty({ example: '닉네임', description: '사용자 닉네임' })
  nickName: string;

  @ApiProperty({
    example: 'http://localhost:3000/image/sample.jpeg',
    description: '유저 프로필 이미지 URL',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    example: true,
    description: '현재 로그인한 유저가 북마크했는지 여부',
  })
  isBookmarked: boolean;

  @ApiProperty({ example: '매일 30분 운동하기', description: '목표 내용' })
  content: string;

  @ApiProperty({ example: 'HEALTH', description: '카테고리' })
  category: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: '목표 생성 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-02T10:00:00Z',
    description: '목표 수정 일자',
  })
  updatedAt: Date | null;

  @ApiProperty({ example: false, description: '목표 완료 여부' })
  isCompleted: boolean;

  @ApiProperty({ example: 12, description: '응원 수' })
  cheerCount: number;
}
