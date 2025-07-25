import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { Tier } from 'src/user/enum/tier.emum';
import { AuthType } from './enum/auth-type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // email을 통해 사용자 찾음
  async findByEmail({ email }: { email: string }) {
    return this.prisma.user.findFirst({
      where: { email },
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
        AuthType: authType,
        tier: Tier.BRONZE,
      },
    });
  }
}
