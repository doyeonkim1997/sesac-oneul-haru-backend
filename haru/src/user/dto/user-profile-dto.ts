import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserProfileDto {
  @ApiProperty({
    type: String,
    description: '닉네임 정보',
    example: 'nickName',
    required: true,
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    type: String,
    description: '이메일 정보',
    example: 'example@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: '유저의 등급(이름표)',
    example: 'BRONZE',
    required: true,
  })
  @IsString()
  tier: string;

  @ApiProperty({
    type: String,
    description: '유저 프로필 이미지 URL',
    example: 'https://cdn.example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image: ImageDto | null;
}
export class ImageDto {
  @ApiProperty()
  imageUrl: string;
}
