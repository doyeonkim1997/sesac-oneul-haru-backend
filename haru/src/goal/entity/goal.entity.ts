import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { GoalCategory } from '../enum/goal-category.enum';

export class GoalEntity {
  @ApiProperty({
    type: Number,
    description: '목표 Id',
    example: 1,
    required: true,
  })
  @IsInt()
  goalId: number;

  @ApiProperty({
    type: Number,
    description: '유저 Id',
    example: 1,
    required: true,
  })
  @IsInt()
  userId: number;

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
  @IsEnum(GoalCategory)
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
    type: Boolean,
    description: '삭제 여부',
    example: false,
    required: true,
  })
  @IsBoolean()
  isDeleted: boolean;

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
