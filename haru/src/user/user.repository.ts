import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { FindUserDto } from './dto/find-user-dto';
import { UpdateOutputUserInfoDto } from './dto/update-output-user-info-dto';
import { ImageEntity } from './entity/image.entity';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 처음 프로필 설정 시 프로필 이미지 생성
  async createImage(imageUrl: string): Promise<ImageEntity> {
    const image = await this.prisma.image.create({
      data: {
        imageUrl,
      },
    });

    return image;
  }

  // 이메일로 사용자 조회
  async findUserByEmail(search: string): Promise<FindUserDto[]> {
    const user = await this.prisma.user.findMany({
      select: {
        userId: true,
        nickName: true,
        email: true,
        tier: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        email: {
          contains: search,
        },
        isDeleted: false,
      },
    });

    return user;
  }

  // userId로 유저의 수정이 필요한 정보 조회
  async findUserByUserId(userId: number): Promise<UpdateOutputUserInfoDto | null> {
    const user = await this.prisma.user.findFirst({
      select: {
        userId: true,
        nickName: true,
        password: true,
        imageId: true,
      },
      where: {
        userId,
        isDeleted: false,
      },
    });

    return user;
  }

  // 해당 사용자의 이미지id 가져옴
  async findProfileImageByUser(user: UserEntity): Promise<ImageEntity | null> {
    const image = await this.prisma.image.findFirst({
      where: {
        user,
      },
    });

    if (!image) {
      return null;
    }

    return image;
  }

  // 사용자 닉네임 변경
  async updateNickname(userId: number, nickName: string): Promise<UpdateOutputUserInfoDto> {
    const updateUser = await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        nickName,
      },
      select: {
        userId: true,
        nickName: true,
        password: true,
        imageId: true,
      },
    });

    return updateUser;
  }

  // 이미지 url 변경
  async updateProfileImage(imageId: number, imageUrl: string): Promise<void> {
    await this.prisma.image.update({
      where: {
        imageId,
      },
      data: {
        imageUrl,
      },
    });
  }

  // 사용자 비밀번호 수정
  async updatePassword(userId: number, password: string): Promise<UpdateOutputUserInfoDto> {
    const user = await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        password,
      },
      select: {
        userId: true,
        nickName: true,
        password: true,
        imageId: true,
      },
    });

    return user;
  }

  // 회원 탈퇴
  async deleteUser(userId: number): Promise<boolean> {
    await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        isDeleted: true,
      },
    });

    return true;
  }
}
