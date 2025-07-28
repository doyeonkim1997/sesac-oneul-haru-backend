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
  @MaxLength(20) // 최대 15자
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호는 최소 8자 이상이며, 문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
  })
  password: string;
}
