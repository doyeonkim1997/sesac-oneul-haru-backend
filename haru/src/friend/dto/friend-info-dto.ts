import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ImageUrlDto } from 'src/user/dto/image-url-dto';

export class FriendInfoDto {
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
}
