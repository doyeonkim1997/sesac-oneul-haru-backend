import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { FindUserDto } from './dto/find-user-dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 닉네임으로 사용자 조회
  async findUserByNickName(search: string): Promise<FindUserDto[]> {
    const user = await this.prisma.user.findMany({
      select: {
        userId: true,
        nickName: true,
        tier: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        nickName: {
          contains: search,
        },
      },
    });

    return user;
  }
}
