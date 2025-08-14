import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNickNameImageDto {
  @ApiProperty({
    type: String,
    description: '유저 닉네임',
    example: 'nickName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nickName: string;
}
