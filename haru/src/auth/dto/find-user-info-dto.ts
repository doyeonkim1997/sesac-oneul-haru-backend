import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindUserInfoDto {
  @ApiProperty({
    type: Number,
    description: '유저id',
    example: '1',
    required: true,
  })
  @IsInt()
  userId: number;

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
    description: '닉네임 정보',
    example: 'nickName',
    required: true,
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    type: String,
    description: '비밀번호 정보',
    example: 'asdfasdf1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: '해싱된 비밀번호',
    example: 'asdkasjdkqwjekqlwj123j12ihqswkfalsk/',
    required: false,
  })
  @IsString()
  refreshToken: string | null;

  @ApiProperty({
    enum: String,
    description: '인증 타입 정보',
    example: 'KAKAO',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  authType: string;

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
