import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { FindUserDto } from './dto/find-user-dto';
import { FriendRequestStatus } from './enum/friend-request-status.enum';
import { FindFriendDto } from './dto/find-friend-dto';

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

  // 사용자 id로 친구 목록 조회
  async findFriendsByUserId(userId: number): Promise<FindFriendDto[]> {
    const results = await this.prisma.friendRequest.findMany({
      where: {
        status: FriendRequestStatus.ACCEPT,
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
      include: {
        requester: {
          select: { userId: true, nickName: true, tier: true },
        },
        receiver: {
          select: { userId: true, nickName: true, tier: true },
        },
      },
    });

    // 요청자/수락자 중 userId가 아닌 쪽을 친구로 반환
    const friends = results.map((req) => {
      if (req.requesterId === userId) {
        return req.receiver;
      } else {
        return req.requester;
      }
    });

    return friends;
  }
}
