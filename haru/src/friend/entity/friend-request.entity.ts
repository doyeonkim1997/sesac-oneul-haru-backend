import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class FriendRequestEntity {
  @ApiProperty({
    type: Number,
    description: '친구 요청id',
    example: 1,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  requestId: number;

  @ApiProperty({
    type: Number,
    description: '유저id',
    example: 1,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    type: Number,
    description: '수신자id',
    example: 1,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @ApiProperty({
    type: String,
    description: '요청 상태 ACCEPT, PENDING',
    example: 'PENDING',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    type: Date,
    description: '요청 생성일자',
    example: '2023-03-12',
    required: true,
  })
  @IsDateString()
  createdAt: Date;
}
