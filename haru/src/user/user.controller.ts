import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindFriendDto } from './dto/find-friend-dto';
import { FindUserDto } from './dto/find-user-dto';
import { UpdateNickNameImageDto } from './dto/update-nickname-image-dto';
import { UpdateOutputUserInfoDto } from './dto/update-output-user-info-dto';
import { UserEntity } from './entity/user.entity';
import { getUser } from './get-user-decorator';
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '이메일로 사용자 조회',
    description: '이메일로 사용자를 조회하며 사용자가 없으면 0의 배열을 반환.',
  })
  @ApiResponse({
    type: FindUserDto,
    isArray: true,
  })
  @Get('/email')
  searchUserByEmail(@Query('search') search: string): Promise<FindUserDto[]> {
    return this.userService.searchUserByEmail(search);
  }

  @ApiOperation({
    summary: '사용자id로 사용자의 친구 목록 조회',
    description: 'userId로 전체 친구 목록을 조회하며 친구가 없으면 0의 배열을 반환.',
  })
  @ApiResponse({
    type: FindFriendDto,
    isArray: true,
  })
  @Get('/:id/friends')
  findFriendsByUserId(@Param('id', ParseIntPipe) id: number): Promise<FindFriendDto[]> {
    return this.userService.getFriendsByUserId(id);
  }

  @ApiOperation({
    summary: '사용자 프로필 수정',
    description: '닉네임, 프로필 사진 변경',
  })
  @ApiResponse({
    type: UpdateOutputUserInfoDto,
  })
  @Patch('/:id/profile')
  @UseGuards(AuthGuard('jwt'))
  updateNickName(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: UserEntity,
    @Body() updateNickNameImageDto: UpdateNickNameImageDto,
  ): Promise<UpdateOutputUserInfoDto> {
    return this.userService.updateNickNameAndImage(id, user, updateNickNameImageDto);
  }

  @ApiOperation({
    summary: '사용자 비밀번호 수정',
    description: '현재 비밀번호, 새 비밀번호, 새 비밀번호 재입력 하여 비밀번호 수정',
  })
  @ApiResponse({
    type: UpdateOutputUserInfoDto,
  })
  @Patch('/:id/password')
  @UseGuards(AuthGuard('jwt'))
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: UserEntity,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdateOutputUserInfoDto> {
    return this.userService.updatePassword(id, user, updatePasswordDto);
  }

  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴',
  })
  @ApiResponse({
    type: String,
  })
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
}
