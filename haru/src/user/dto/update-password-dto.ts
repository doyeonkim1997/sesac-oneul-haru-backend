import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: '현재 비밀번호',
    example: 'password1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호는 최소 8자 이상이며, 문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
  })
  currentPassword: string;

  @ApiProperty({
    type: String,
    description: '새로운 비밀번호',
    example: 'newpassword1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8) // 최소 8자
  @MaxLength(20) // 최대 20자
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호는 최소 8자 이상이며, 문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
  })
  newPassword: string;

  @ApiProperty({
    type: String,
    description: '확인용 비밀번호',
    example: 'newpassword1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호는 최소 8자 이상이며, 문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
  })
  confirmPassword: string;
}
