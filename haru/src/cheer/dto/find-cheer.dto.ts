import { ApiProperty } from '@nestjs/swagger';

export class FindCheerDto {
  @ApiProperty({
    type: Number,
    description: '응원 Id',
    example: 1,
    required: true,
  })
  cheerId: number;

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

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: '목표 생성 일자',
  })
  createdAt: Date;
}
