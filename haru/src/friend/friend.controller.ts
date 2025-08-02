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
import { FriendGoalsDto } from './dto/friend-goals-dto';
import { FriendInfoDto } from './dto/friend-info-dto';
import { FriendRequestDto } from './dto/friend-request-dto';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({
    summary: '사용자의 친구 목록 조회',
    description: '전체 친구 목록을 조회하며 친구가 없으면 0의 배열을 반환.',
  })
  @ApiResponse({
    type: FindFriendDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 친구입니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/friends')
  findFriendsByUserId(@getUser() user: UserEntity): Promise<FindFriendDto[]> {
    return this.friendService.getFriendsByUserId(user);
  }

  @ApiOperation({
    summary: '사용자의 친구 요청 목록 조회',
    description: '전체 친구 요청 목록을 조회하며 요청이 없으면 0의 배열을 반환.',
  })
  @ApiResponse({
    type: FriendRequestDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/requests')
  findAllFriendRequests(@getUser() user: UserEntity): Promise<FriendRequestDto[]> {
    return this.friendService.findAllFriendRequests(user.userId);
  }

  @ApiOperation({
    summary: '친구 요청 보내기',
    description: 'receiverId 친구의 userId Param값으로 전달',
  })
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

  @ApiOperation({ summary: '친구 요청 수락', description: '요청id를 받고 해당 요청 수락 ' })
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

  @ApiOperation({ summary: '친구 요청 거절', description: '요청id를 받고 해당 요청 거절' })
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
  @ApiNotFoundResponse({
    description: '친구 요청이 존재하지 않습니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/friends/:requestId')
  removeFriend(@Param('requestId', ParseIntPipe) requestId: number): Promise<string> {
    return this.friendService.removeFriend(requestId);
  }

  @ApiOperation({
    summary: '친구 목록에서 친구 프로필 조회',
    description: '친구id로 친구 프로필 정보 조회 ',
  })
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
  @Get('/friends/:friendId')
  showFriendInfo(@Param('friendId', ParseIntPipe) friendId: number): Promise<FriendInfoDto> {
    return this.friendService.showFriendInfo(friendId);
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
  @Get('/goals/:friendId')
  showFriendGoals(
    @getUser() user: UserEntity,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<FriendGoalsDto[]> {
    return this.friendService.showFriendGoals(user, friendId);
  }
}
