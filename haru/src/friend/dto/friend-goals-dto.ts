import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class FriendGoalsDto {
  @ApiProperty({
    type: Number,
    description: '목표 Id',
    example: 1,
    required: true,
  })
  @IsInt()
  goalId: number;

  @ApiProperty({
    type: String,
    description: '내용',
    example: '매일 30분 운동하기',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    type: String,
    description: '카테고리',
    example: 'HEALTH',
    required: true,
  })
  @IsString()
  category: string;

  @ApiProperty({
    type: Boolean,
    description: '완료 여부',
    example: false,
    required: true,
  })
  @IsBoolean()
  isCompleted: boolean;

  @ApiProperty({
    type: Number,
    description: '응원 수',
    example: 10,
    required: true,
  })
  @IsInt()
  cheerCount: number;

  @ApiProperty({
    example: true,
    description: '현재 로그인한 유저가 북마크했는지 여부',
  })
  isBookmarked: boolean;

  @ApiProperty({
    type: Date,
    description: '생성 일자',
    example: '2023-10-01T12:00:00Z',
    required: true,
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: '수정 일자',
    example: '2023-10-01T12:00:00Z',
    required: true,
  })
  @IsDateString()
  updatedAt: Date | null;
}
