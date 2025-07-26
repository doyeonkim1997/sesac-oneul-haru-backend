import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class EmailLoginDto {
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
  @MaxLength(15) // 최대 15자
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 문자와 숫자만 가능합니다.',
  }) // 비밀번호 입력 시 문자와 숫자만 가능
  password: string;
}
