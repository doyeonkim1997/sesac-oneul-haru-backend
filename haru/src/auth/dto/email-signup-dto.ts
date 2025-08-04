import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class EmailSignUpDto {
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
    description: '비밀번호',
    example: 'password1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8) // 최소 8자
  @MaxLength(20) // 최대 20자
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: '비밀번호는 문자와 숫자를 각각 1개 이상 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({
    type: String,
    description: '비밀번호 일치 여부 확인',
    example: 'password1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8) // 최소 8자
  @MaxLength(20) // 최대 20자
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: '비밀번호는 문자와 숫자를 각각 1개 이상 포함해야 합니다.',
  })
  confirmPassword: string;

  @ApiProperty({
    type: String,
    description: '닉네임',
    example: 'nickname',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nickName: string;
}
