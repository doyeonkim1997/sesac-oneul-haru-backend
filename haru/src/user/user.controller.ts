import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindUserDto } from './dto/find-user-dto';
import { UserService } from './user.service';
import { FindFriendDto } from './dto/find-friend-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '닉네임으로 사용자 조회',
    description: '닉네임으로 사용자를 조회하며 사용자가 없으면 0의 배열을 반환.',
  })
  @ApiResponse({
    type: FindUserDto,
    isArray: true,
  })
  @Get('/search')
  searchUserByNickName(@Query('search') search: string): Promise<FindUserDto[]> {
    return this.searchUserByNickName(search);
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
    return this.findFriendsByUserId(id);
  }
}
