import { Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/find-user-dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // 특정 사용자 조회
  async searchUserByNickName(search: string): Promise<FindUserDto[]> {
    const users = await this.userRepository.findUserByNickName(search);

    return users;
  }
}
