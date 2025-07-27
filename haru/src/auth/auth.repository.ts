import { Injectable } from '@nestjs/common';
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
}
