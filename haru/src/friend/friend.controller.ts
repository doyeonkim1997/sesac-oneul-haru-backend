import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';
import { getUser } from 'src/user/get-user-decorator';
import { FindFriendDto } from './dto/find-friend-dto';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({ summary: '친구 요청 보내기' })
  @ApiResponse({
    type: String,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/request/:receiverId')
  async sendFriendRequest(
    @getUser() user: UserEntity,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ): Promise<string> {
    return this.friendService.sendFriendRequest(user.userId, receiverId);
  }

  @ApiOperation({
    summary: '사용자id로 사용자의 친구 목록 조회',
    description: 'userId로 전체 친구 목록을 조회하며 친구가 없으면 0의 배열을 반환.',
  })
  @ApiResponse({
    type: FindFriendDto,
    isArray: true,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/friends')
  findFriendsByUserId(@Param('id', ParseIntPipe) id: number): Promise<FindFriendDto[]> {
    return this.friendService.getFriendsByUserId(id);
  }

  @ApiOperation({ summary: '친구 요청 수락' })
  @ApiResponse({
    type: String,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/accept/:requestId')
  acceptFriendRequest(
    @getUser() user: UserEntity,
    @Param('requestId', ParseIntPipe) requestId: number,
  ): Promise<string> {
    return this.friendService.acceptFriendRequest(requestId, user);
  }

  @ApiOperation({ summary: '친구 요청 거절' })
  @ApiResponse({
    type: String,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/reject/:requestId')
  rejectFriendRequest(
    @getUser() user: UserEntity,
    @Param('requestId', ParseIntPipe) requestId: number,
  ): Promise<string> {
    return this.friendService.rejectFriendRequest(requestId, user);
  }

  @ApiOperation({ summary: '친구 목록에서 친구 삭제' })
  @ApiResponse({
    type: String,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/friends/:requestId')
  removeFriend(
    @getUser() user: UserEntity,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return this.friendService.removeFriend(requestId, user, id);
  }

  @ApiOperation({ summary: '친구 목록에서 친구 프로필 조회' })
  @ApiResponse({
    type: FindFriendDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/friends/:friendId')
  showFriendInfo(
    @getUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<FindFriendDto> {
    return this.friendService.showFriendInfo(user, id, friendId);
  }
}
