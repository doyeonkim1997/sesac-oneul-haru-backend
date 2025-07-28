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

  @ApiProperty({
    type: String,
    description: '이미지 url',
    example: 'askldjqklwasldasf.a,f',
    required: false,
  })
  @IsString()
  imageUrl: string | null;
}
