import { ApiProperty } from '@nestjs/swagger';

export class FindUserInfoDto {
  @ApiProperty({
    type: String,
    description: '이메일 정보',
    example: 'example@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    type: Number,
    description: '유저id',
    example: '1',
    required: true,
  })
  userId: number;

  @ApiProperty({
    type: String,
    description: '닉네임 정보',
    example: 'nickName',
    required: true,
  })
  nickName: string;

  @ApiProperty({
    type: String,
    description: '비밀번호 정보',
    example: 'asdfasdf1234',
    required: true,
  })
  password: string;

  @ApiProperty({
    enum: String,
    description: '인증 타입 정보',
    example: 'KAKAO',
    required: true,
  })
  authType: string;
}
