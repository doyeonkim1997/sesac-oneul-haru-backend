import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendMailDto {
  @ApiProperty({
    type: String,
    description: '이메일 인증시 입력한 이메일',
    example: 'example@exaple.com',
    required: true,
  })
  @IsEmail()
  email: string;
}
