import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';

export class FriendRequestDto {
  @ApiProperty({ type: Number, description: '친구 요청 ID', example: 10 })
  @IsInt()
  requestId: number;

  @ApiProperty({ type: Number, description: '유저 ID', example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ type: String, description: '닉네임', example: 'nickName' })
  @IsString()
  nickName: string;

  @ApiProperty({ type: String, description: '이메일', example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: '등급', example: 'GOLD' })
  @IsString()
  tier: string;

  @ApiProperty({
    type: String,
    description: '유저 프로필 이미지 URL',
    example: 'https://cdn.example.com/profile.jpg',
    required: false,
  })
  @IsString()
  imageUrl: string | null;
}
