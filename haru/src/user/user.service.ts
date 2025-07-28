import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindFriendDto } from './dto/find-friend-dto';
import { FindUserDto } from './dto/find-user-dto';
import { UpdateNickNameImageDto } from './dto/update-nickname-image-dto';
import { UpdateOutputUserInfoDto } from './dto/update-output-user-info-dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  constructor(private readonly userRepository: UserRepository) {}

  // 이메일로 특정 사용자 조회
  async searchUserByEmail(search: string): Promise<FindUserDto[]> {
    const users = await this.userRepository.findUserByEmail(search);

    return users;
  }

  // 사용자 id로 친구 목록 조회
  async getFriendsByUserId(userId: number): Promise<FindFriendDto[]> {
    return this.userRepository.findFriendsByUserId(userId);
  }

  // 사용자 닉네임 수정
  async updateNickNameAndImage(
    userId: number,
    user: UserEntity,
    updateNickNameImageDto: UpdateNickNameImageDto,
  ): Promise<UpdateOutputUserInfoDto> {
    const { nickName, imageUrl } = updateNickNameImageDto;
    if (userId !== user.userId) {
      throw new ForbiddenException('해당 사용자가 로그인한 사용자가 아닙니다.');
    }

    const findUser = await this.userRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 이미지 Url이 있을 경우
    if (imageUrl) {
      const profileImage = await this.userRepository.findProfileImageByUser(user);

      // 이미지가 존재하지않을 경우 (처음 이미지 설정)
      if (!profileImage) {
        // 이미지 생성 후 설정
        const image = await this.userRepository.createImage(imageUrl);
        await this.userRepository.updateProfileImage(image.imageId, imageUrl);
      } else {
        await this.userRepository.updateProfileImage(profileImage.imageId, imageUrl);
      }
    }

    return await this.userRepository.updateNickname(findUser.userId, nickName);
  }

  // 사용자 비밀번호 수정
  async updatePassword(
    userId: number,
    user: UserEntity,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdateOutputUserInfoDto> {
    const { currentPassword, newPassword, confirmPassword } = updatePasswordDto;

    if (userId !== user.userId) {
      throw new UnauthorizedException('해당 사용자가 로그인한 사용자가 아닙니다.');
    }

    const findUser = await this.userRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (!(await bcrypt.compare(currentPassword, findUser.password))) {
      throw new BadRequestException('현재 비밀번호를 다시 입력해주세요.');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('비밀번호 일치 여부를 확인해주세요.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return await this.userRepository.updatePassword(findUser.userId, hashedPassword);
  }

  // 회원 탈퇴
  async deleteUser(userId: number, user: UserEntity): Promise<string> {
    this.logger.debug(`userId: ${userId}이고 user는 ${user.userId}`);
    this.logger.debug(` 불린 값 : ${user.userId !== userId}`);
    this.logger.debug(`userId type: ${typeof userId}, user.userId type: ${typeof user.userId}`);

    if (userId !== user.userId) {
      throw new UnauthorizedException('해당 사용자가 로그인한 사용자가 아닙니다.');
    }

    this.logger.debug(`회원탈퇴 service 실행`);

    const findUser = await this.userRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const isDeleted = await this.userRepository.deleteUser(userId);

    if (!isDeleted) {
      return '회원 탈퇴 실패';
    }

    return '회원 탈퇴 성공';
  }
}
