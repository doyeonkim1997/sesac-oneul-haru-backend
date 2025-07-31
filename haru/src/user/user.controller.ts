import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { multerOptions } from 'src/utils/multer/multer-config';
import { FindUserDto } from './dto/find-user-dto';
import { UpdateNickNameImageDto } from './dto/update-nickname-image-dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { UserEntity } from './entity/user.entity';
import { getUser } from './get-user-decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '이메일로 사용자 조회',
    description: '이메일로 사용자를 조회하며 사용자가 없으면 0의 배열을 반환.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 배열',
    type: FindUserDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiBearerAuth()
  @Get('/email')
  @UseGuards(AuthGuard('jwt'))
  searchUserByEmail(@Query('search') search: string): Promise<FindUserDto[]> {
    return this.userService.searchUserByEmail(search);
  }

  @ApiOperation({
    summary: '사용자 프로필 수정',
    description: '닉네임, 프로필 사진 변경',
  })
  @ApiResponse({
    description: '사용자 프로필 수정 완료.',
    status: 200,
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없습니다.',
  })
  @ApiBearerAuth()
  @Patch('/:id/profile')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @UseGuards(AuthGuard('jwt'))
  updateNickName(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateNickNameImageDto: UpdateNickNameImageDto,
  ): string {
    this.userService.updateNickNameAndImage(id, user, file, updateNickNameImageDto);
    return '사용자 프로필 수정 완료.';
  }

  @ApiOperation({
    summary: '사용자 비밀번호 수정',
    description: '현재 비밀번호, 새 비밀번호, 새 비밀번호 재입력 하여 비밀번호 수정',
  })
  @ApiResponse({
    description: '사용자 비밀번호 수정 완료.',
    status: 200,
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '현재 비밀번호를 다시 입력해주세요.',
  })
  @ApiBadRequestResponse({
    description: '비밀번호 일치 여부를 확인해주세요.',
  })
  @ApiBearerAuth()
  @Patch('/:id/password')
  @UseGuards(AuthGuard('jwt'))
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: UserEntity,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): string {
    this.userService.updatePassword(id, user, updatePasswordDto);
    return '사용자 비밀번호 수정 완료.';
  }

  @ApiOperation({
    summary: '사용자 등급업',
    description: '완료된 목표가 10개면 SILVER, 50개면 GOLD, 100개면 DIAMOND',
  })
  @ApiResponse({
    description: '등급업 상태 메시지.',
    status: 200,
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiBearerAuth()
  @Patch('/:id/tier')
  @UseGuards(AuthGuard('jwt'))
  updateTier(@Param('id', ParseIntPipe) id: number, @getUser() user: UserEntity): Promise<string> {
    return this.userService.updateTier(id, user);
  }

  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴',
  })
  @ApiResponse({
    status: 200,
    type: String,
    description: '회원 탈퇴 성공',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiNotFoundResponse({
    description: '사용자를 찾을 수 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '회원 탈퇴 실패',
  })
  @ApiBearerAuth()
  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@getUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.userService.deleteUser(id, user);
  }

  // 인증정보 불러오기 테스트용 API
  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  testUser(@getUser() user: UserEntity) {
    console.log(user.userId);
  }

  // 파일 받기 테스트용 API
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @Post('/upload/image')
  @UseGuards(AuthGuard('jwt'))
  uploadImage(@getUser() user: UserEntity, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('이미지 파일이 필요합니다.');
    }

    const imageUrl = file.path.replace(/\\/g, '/').replace(/^public/, '');

    this.userService.uploadUserImage(user.userId, imageUrl);

    return { imageUrl };

    // console.log(file);
    // return this.userService.imageUpload(file);
  }

  // 기본 이미지 생성용 회원가입 전 무조건 한 번 실행
  @Get('/defaultImage')
  defaultImage() {
    return this.userService.saveDefaultImage();
  }
}
