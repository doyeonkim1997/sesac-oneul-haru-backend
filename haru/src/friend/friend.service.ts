import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { validateLogin } from 'src/auth/validator/validateLogin';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRepository } from '../user/user.repository';
import { FindFriendDto } from './dto/find-friend-dto';
import { FriendGoalsDto } from './dto/friend-goals-dto';
import { FriendInfoDto } from './dto/friend-info-dto';
import { FriendRequestDto } from './dto/friend-request-dto';
import { FriendRequestStatus } from './enum/friend-request-status.enum';
import { FriendRepository } from './friend.repository';

@Injectable()
export class FriendService {
  private logger = new Logger('FriendService');
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // 친구 요청 보내기
  async sendFriendRequest(userId: number, receiverId: number): Promise<string> {
    if (userId === receiverId) {
      throw new BadRequestException('자기 자신에게 요청할 수 없습니다.');
    }

    const existing = await this.friendRepository.findFriendRequestByUserId(userId, receiverId);
    if (existing) {
      throw new BadRequestException('이미 친구 요청을 보냈거나 요청이 존재합니다.');
    }

    await this.friendRepository.createFriendRequest(userId, receiverId);

    return '친구 요청 성공';
  }

  // 친구 요청 수락
  async acceptFriendRequest(requestId: number, user: UserEntity): Promise<string> {
    this.logger.debug(`친구요청 수락 실행`);

    // requestId로 요청 받은 사용자 불러오기
    const findUser = await this.friendRepository.findUserByRequestId(requestId);

    if (!findUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 로그인 검사
    validateLogin(findUser.receiverId, user.userId);

    await this.friendRepository.updateRequestStatus(requestId, FriendRequestStatus.ACCEPT);

    return '친구 요청 수락 완료';
  }

  // 친구 요청 거절
  async rejectFriendRequest(requestId: number, user: UserEntity): Promise<string> {
    this.logger.debug(`친구요청 거절 실행`);

    // requestId로 요청 받은 사용자 불러오기
    const findUser = await this.friendRepository.findUserByRequestId(requestId);

    if (!findUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 로그인 검사
    validateLogin(findUser.receiverId, user.userId);

    await this.friendRepository.deleteRequest(requestId);

    return '친구 요청 거절 완료';
  }

  // userId로 친구 목록 조회
  async getFriendsByUserId(user: UserEntity): Promise<FindFriendDto[]> {
    return await this.friendRepository.findAllFriendsByUserId(user.userId);
  }

  // userId로 모든 친구요청 조회
  async findAllFriendRequests(userId: number): Promise<FriendRequestDto[]> {
    const requests = await this.friendRepository.findAllFriendRequests(userId);

    return requests;
  }

  // userId로 사용자가 보낸 모든 친구요청 조회
  async findAllSentFriendRequests(userId: number): Promise<FriendRequestDto[]> {
    const requests = await this.friendRepository.findAllSentFriendRequests(userId);

    return requests;
  }

  // 친구 프로필 정보 조회
  async showFriendInfo(friendId: number): Promise<FriendInfoDto> {
    const findFriend = await this.friendRepository.findFriendByUserId(friendId);

    if (!findFriend) {
      throw new NotFoundException('존재하지 않는 친구입니다.');
    }

    return findFriend;
  }

  // 친구 목표 목록 조회
  async showFriendGoals(user: UserEntity, friendId: number): Promise<FriendGoalsDto[]> {
    if (user.userId === friendId) {
      throw new BadRequestException('친구가 아닌 사용자를 조회했습니다.');
    }
    return await this.friendRepository.findFriendGoalsByFriendId(friendId, user.userId);
  }

  // 친구 삭제
  async removeFriend(requestId: number) {
    const findRequest = await this.friendRepository.findFriendRequestByRequestId(requestId);

    if (!findRequest) {
      throw new NotFoundException('친구 요청이 존재하지 않습니다.');
    }

    await this.friendRepository.deleteRequest(requestId);

    return '친구 삭제 완료.';
  }
}
