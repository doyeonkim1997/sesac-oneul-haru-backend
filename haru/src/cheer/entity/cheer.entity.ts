import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';

export class CheerEntity {
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
    type: Date,
    description: '생성 일자',
    example: '2023-10-01T12:00:00Z',
    required: true,
  })
  @IsDateString()
  createdAt: Date;
}

// cheerId   Int      @id @default(autoincrement()) @map("cheer_id")
//   userId    Int      @map("user_id")
//   goalId    Int      @map("goal_id")
//   createdAt
