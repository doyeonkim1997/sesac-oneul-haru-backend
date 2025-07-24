import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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
    description: '이메일',
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
