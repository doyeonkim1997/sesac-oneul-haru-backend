import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ImageUrlDto } from './image-url-dto';

export class FindUserDto {
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
    description: '유저의 등급(이름표)',
    example: 'BRONZE',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tier: string;

  @ApiProperty({
    type: ImageUrlDto,
    description: '이미지 URL',
    example: 'https://example.com/image.png',
    required: true,
  })
  @IsNotEmpty()
  image: ImageUrlDto | null;

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
