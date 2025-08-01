import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindFriendDto {
  @ApiProperty({ type: Number, description: '친구 요청 ID', example: 10 })
  @IsInt()
  @IsNotEmpty()
  requestId: number;

  @ApiProperty({ type: Number, description: '유저 ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ type: String, description: '닉네임', example: 'nickName' })
  @IsString()
  @IsNotEmpty()
  nickName: string;

  @ApiProperty({ type: String, description: '이메일', example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, description: '등급', example: 'GOLD' })
  @IsString()
  @IsNotEmpty()
  tier: string;

  @ApiProperty({
    type: String,
    description: '유저 프로필 이미지 URL',
    example: 'https://cdn.example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl: string | null;
}
