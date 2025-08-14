import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationEntity {
  @ApiProperty({
    type: Number,
    description: '이메일 인증id',
    example: '3',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  emailId: number;

  @ApiProperty({
    type: String,
    description: '이메일 인증을 위해 저장한 이메일',
    example: 'example@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: '이메일 인증을 위해 저장할 유효한 인증 코드',
    example: 'KSKDOW132SD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  validCode: string;

  @ApiProperty({
    type: Date,
    description: '유효 시간',
    example: '2021-02-12',
    required: false,
  })
  @IsDateString()
  expirationTime: Date;

  @ApiProperty({
    type: Date,
    description: '생성 시간',
    example: '2021-02-12',
    required: true,
  })
  @IsDateString()
  createdAt: Date;
}
