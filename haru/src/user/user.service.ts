import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindUserDto } from './dto/find-user-dto';
import { UpdateNickNameImageDto } from './dto/update-nickname-image-dto';
import { UpdateOutputUserInfoDto } from './dto/update-output-user-info-dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { Tier } from './enum/tier.emum';
import { UserRepository } from './user.repository';
import { UserProfileDto } from './dto/user-profile-dto';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  constructor(private readonly userRepository: UserRepository) {}

  // 이메일로 특정 사용자 조회
  async searchUserByEmail(search: string): Promise<FindUserDto[]> {
    const users = await this.userRepository.findUserByEmail(search);

    return users;
  }

  // 유저 프로필 정보 가져오기
  async getUserProfile(user: UserEntity): Promise<UserProfileDto> {
    const profile = await this.userRepository.findUserProfileById(user.userId);

    if (!profile) {
      throw new NotFoundException('프로필 정보를 찾을 수 없습니다.');
    }

    return profile;
  }

  // 사용자 닉네임 수정
  async updateNickNameAndImage(
    user: UserEntity,
    file: Express.Multer.File,
    updateNickNameImageDto: UpdateNickNameImageDto,
  ): Promise<UpdateOutputUserInfoDto> {
    const { nickName } = updateNickNameImageDto;

    let imageUrl: string | null;

    // 이미지 파일을 변하하지 않음
    if (!file) {
      imageUrl = null;
    }

    imageUrl = file.path.replace(/\\/g, '/').replace(/^public/, '');

    const findUser = await this.userRepository.findUserByUserIdForUpdate(user.userId);

    if (!findUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.uploadUserImage(user.userId, imageUrl);

    // 이미지 Url이 있을 경우
    // if (imageUrl) {
    //   const profileImage = await this.userRepository.findProfileImageByUser(user);

    //   // 이미지가 존재하지않을 경우 (처음 이미지 설정)
    //   if (!profileImage) {
    //     // 이미지 생성 후 설정(기본 이미지 생성하면 필요없어질 로직)
    //     const image = await this.userRepository.createImage(imageUrl);
    //     await this.userRepository.updateProfileImage(image.imageId, imageUrl);
    //   } else {
    //     await this.userRepository.updateProfileImage(profileImage.imageId, imageUrl);
    //   }
    // }

    return await this.userRepository.updateNickname(findUser.userId, nickName);
  }

  // 사용자 비밀번호 수정
  async updatePassword(
    user: UserEntity,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdateOutputUserInfoDto> {
    const { currentPassword, newPassword, confirmPassword } = updatePasswordDto;

    const findUser = await this.userRepository.findUserByUserIdForUpdate(user.userId);

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

  // 사용자 등급 변경
  async updateTier(user: UserEntity): Promise<string> {
    const goalCount = await this.userRepository.findGoalCount(user.userId);

    if (goalCount >= 100) {
      await this.userRepository.updateUserTier(user.userId, Tier.DIAMOND);
      return `사용자의 등급이 ${Tier.DIAMOND}로 상승되었습니다.`;
    }

    if (goalCount >= 50) {
      await this.userRepository.updateUserTier(user.userId, Tier.GOLD);
      return `사용자의 등급이 ${Tier.GOLD}로 상승되었습니다.`;
    }

    if (goalCount >= 10) {
      await this.userRepository.updateUserTier(user.userId, Tier.SILVER);
      return `사용자의 등급이 ${Tier.SILVER}로 상승되었습니다.`;
    }

    return '사용자의 등급이 그대로입니다.';
  }

  // 회원 탈퇴
  async deleteUser(user: UserEntity): Promise<string> {
    this.logger.debug(`회원탈퇴 service 실행`);

    const findUser = await this.userRepository.findUserByUserIdForUpdate(user.userId);

    if (!findUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const isDeleted = await this.userRepository.deleteUser(user.userId);

    if (!isDeleted) {
      throw new InternalServerErrorException('회원 탈퇴 실패');
    }

    return '회원 탈퇴 성공';
  }

  // imageUpload(file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('파일이 존재하지 않습니다.');
  //   }

  //   return file.path;
  // }

  async uploadUserImage(userId: number, imageUrl: string) {
    // 이미지 테이블 저장
    const image = await this.userRepository.createImage(imageUrl);

    // user에 저장된 이미지id 저장
    await this.userRepository.updateImageId(userId, image.imageId);
  }

  // 기본 이미지 저장용
  async saveDefaultImage(): Promise<void> {
    await this.userRepository.saveDefaultImage();
  }
}
