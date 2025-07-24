import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { SocialUserAfterAuth } from './user.decorator';
import { Tier } from 'src/user/enum/tier.emum';
import { AuthType } from './enum/auth-type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail({ email }: { email: string }) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async createUser({ createUserDto }: { createUserDto: SocialUserAfterAuth }) {
    const { email, password, nickName } = createUserDto;

    return this.prisma.user.create({
      data: {
        email,
        password,
        nickName: nickName,
        AuthType: AuthType.KAKAO,
        tier: Tier.BRONZE,
      },
    });
  }
}
