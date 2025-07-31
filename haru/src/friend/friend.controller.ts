import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';
import { getUser } from 'src/user/get-user-decorator';
import { FindFriendDto } from './dto/find-friend-dto';
import { FriendService } from './friend.service';
import { FriendGoalsDto } from './dto/friend-goals-dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({ summary: '친구 요청 보내기' })
  @ApiResponse({
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiBadRequestResponse({
    description: '자기 자신에게 요청할 수 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '이미 친구 요청을 보냈거나 요청이 존재합니다.',
  })
  @ApiBearerAuth()
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
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 친구입니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId/friends')
  findFriendsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @getUser() user: UserEntity,
  ): Promise<FindFriendDto[]> {
    return this.friendService.getFriendsByUserId(userId, user);
  }

  @ApiOperation({ summary: '친구 요청 수락' })
  @ApiResponse({
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
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiNotFoundResponse({
    description: '친구 요청이 존재하지 않습니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:userId/friends/:requestId')
  removeFriend(
    @getUser() user: UserEntity,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<string> {
    return this.friendService.removeFriend(requestId, user, userId);
  }

  @ApiOperation({ summary: '친구 목록에서 친구 프로필 조회' })
  @ApiResponse({
    type: FindFriendDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 친구입니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId/friends/:friendId')
  showFriendInfo(
    @getUser() user: UserEntity,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<FindFriendDto> {
    return this.friendService.showFriendInfo(user, userId, friendId);
  }

  @ApiOperation({ summary: '친구의 목표 목록 조회' })
  @ApiResponse({
    type: FriendGoalsDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId/goals/:friendId')
  showFriendGoals(
    @getUser() user: UserEntity,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<FriendGoalsDto[]> {
    return this.friendService.showFriendGoals(user, userId, friendId);
  }
}
