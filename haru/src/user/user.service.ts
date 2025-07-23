import { Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/find-user-dto';
import { UserRepository } from './user.repository';
import { FindFriendDto } from './dto/find-friend-dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // 특정 사용자 조회
  async searchUserByNickName(search: string): Promise<FindUserDto[]> {
    const users = await this.userRepository.findUserByNickName(search);

    return users;
  }

  // 사용자 id로 친구 목록 조회
  async getFriendsByUserId(userId: number): Promise<FindFriendDto[]> {
    return this.userRepository.findFriendsByUserId(userId);
  }
}
