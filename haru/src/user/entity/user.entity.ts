import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UserEntity {
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
    type: String,
    description: '유저 닉네임',
    example: 'nickName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nickName: string;

  @ApiProperty({
    type: String,
    description: '이메일, 로그인/회원가입 시 아이디로 사용',
    example: 'example@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: '해싱된 비밀번호',
    example: 'asdkasjdkqwjekqlwj123j12ihqswkfalsk/',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'accessToken 만료 시 재발급을 위한 refreshToken',
    example: 'aksdjpqwrusjnvkahsfsk12ashfliuawh',
    required: false,
  })
  @IsString()
  refreshToken: string;

  @ApiProperty({
    type: String,
    description: '가입 방식 (EMAIL, KAKAO, GOOGLE, NAVER)',
    example: 'NAVER',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  authType: string;

  @ApiProperty({
    type: String,
    description: '유저의 등급(이름표)',
    example: 'BRONZE',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tier: string;

  @ApiProperty({
    type: Number,
    description: '이미지 테이블의 이미지id',
    example: '2',
    required: true,
  })
  @IsInt()
  imageId: number | null;

  @ApiProperty({
    type: Boolean,
    description: '회원 탈퇴 여부',
    example: 'true',
    required: true,
  })
  @IsInt()
  isDeleted: boolean;

  @ApiProperty({
    type: Date,
    description: '유저 생성일',
    example: '2021-02-12',
    required: true,
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: '유저 정보 수정일',
    example: '2023-03-12',
    required: false,
  })
  @IsDateString()
  updatedAt: Date | null;
}
