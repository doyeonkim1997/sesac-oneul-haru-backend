import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckPasswordDto {
  @ApiProperty({
    type: String,
    description: '현재 비밀번호',
    example: '*password1234',
    required: true,
  })
  @IsString()
  password: string;
}
