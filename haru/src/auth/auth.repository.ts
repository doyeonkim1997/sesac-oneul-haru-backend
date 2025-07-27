import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { Tier } from 'src/user/enum/tier.emum';
import { FindUserInfoDto } from './dto/find-user-info-dto';
import { AuthType } from './enum/auth-type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // email을 통해 사용자 찾음
  async findByEmail({ email }: { email: string }): Promise<FindUserInfoDto | null> {
    return this.prisma.user.findFirst({
      where: { email },
      select: {
        email: true,
        userId: true,
        nickName: true,
        password: true,
        authType: true,
        refreshToken: true,
      },
    });
  }

  // userId를 통해 사용자 찾음
  async findByUserId(userId: number): Promise<FindUserInfoDto | null> {
    return this.prisma.user.findFirst({
      where: { userId },
      select: {
        email: true,
        userId: true,
        nickName: true,
        password: true,
        authType: true,
        refreshToken: true,
      },
    });
  }

  // 회원 가입
  async createUser({
    createUserDto,
    authType,
  }: {
    createUserDto: { email; hashedPassword; nickName };
    authType: AuthType;
  }) {
    const { email, hashedPassword, nickName } = createUserDto;
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickName: nickName,
        authType: authType,
        tier: Tier.BRONZE,
      },
    });
  }

  // refreshToken DB 저장
  async setRefreshToken(refreshToken: string, userId: number) {
    // 저장 시 해싱하여 저장
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    return await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  // 로그아웃 시 refreshToken 제거
  async deleteRefreshToken(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }
}
