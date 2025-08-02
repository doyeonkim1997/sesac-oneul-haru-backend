import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { FindFriendDto } from './dto/find-friend-dto';
import { FriendGoalsDto } from './dto/friend-goals-dto';
import { FriendInfoDto } from './dto/friend-info-dto';
import { FriendRequestDto } from './dto/friend-request-dto';
import { UpdateFriendDto } from './dto/update-friend-dto';
import { FriendRequestStatus } from './enum/friend-request-status.enum';

@Injectable()
export class FriendRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 친구 요청 보내기 (친구 요청 생성)
  async createFriendRequest(userId: number, receiverId: number): Promise<UpdateFriendDto> {
    const friendRequest = this.prisma.friendRequest.create({
      data: {
        userId,
        receiverId,
      },
    });

    return friendRequest;
  }

  // 수신자id, 발신자id로 친구 요청 조회
  async findFriendRequestByUserId(
    userId: number,
    receiverId: number,
  ): Promise<UpdateFriendDto | null> {
    return this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            userId,
            receiverId,
            status: { in: ['PENDING', 'ACCEPT'] },
          },
          {
            userId: receiverId,
            receiverId: userId,
            status: { in: ['PENDING', 'ACCEPT'] },
          },
        ],
      },
    });
  }

  // requestId로 친구 요청조회
  async findFriendRequestByRequestId(requestId: number): Promise<UpdateFriendDto | null> {
    return this.prisma.friendRequest.findFirst({
      where: {
        requestId,
      },
    });
  }

  // 친구 요청id로 요청받은 사용자id 조회
  async findUserByRequestId(requestId: number): Promise<{ receiverId: number } | null> {
    return this.prisma.friendRequest.findUnique({
      where: {
        requestId,
      },
      select: {
        receiverId: true,
      },
    });
  }

  // 사용자Id로 친구 정보 조회
  async findFriendByUserId(userId: number): Promise<FriendInfoDto | null> {
    const friend = await this.prisma.user.findFirst({
      where: {
        userId,
      },
      select: {
        userId: true,
        nickName: true,
        email: true,
        tier: true,
        image: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    return friend;
  }

  // 친구 요청 + 요청자 닉네임/이미지 함께 조회
  async findAllFriendRequests(userId: number): Promise<FriendRequestDto[]> {
    const requests = await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId, // 나에게 온 요청
        status: 'PENDING',
      },
      select: {
        requestId: true,
        userId: true,
        receiverId: true,
        status: true,
        createdAt: true,
        user: {
          // 요청 보낸 유저 정보
          select: {
            nickName: true,
            email: true,
            tier: true,
            image: {
              select: {
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    // 데이터 가공: user → nickName, imageUrl 꺼내기
    return requests.map((request) => ({
      requestId: request.requestId,
      userId: request.userId,
      receiverId: request.receiverId,
      email: request.user.email,
      tier: request.user.tier,
      status: request.status,
      createdAt: request.createdAt,
      nickName: request.user.nickName,
      imageUrl: request.user.image?.imageUrl || null,
    }));
  }

  // 친구id로 친구의 모든 목표 목록 조회
  async findFriendGoalsByFriendId(friendId: number, userId: number): Promise<FriendGoalsDto[]> {
    const result = await this.prisma.goal.findMany({
      where: {
        userId: friendId,
        isDeleted: false,
      },
      select: {
        bookmarks: {
          where: {
            userId,
          },
          select: {
            bookmarkId: true,
          },
        },

        user: {
          where: {
            userId: friendId,
          },
          select: {
            nickName: true,
            image: {
              select: {
                imageUrl: true,
              },
            },
          },
        },

        userId: true,
        goalId: true,
        content: true,
        category: true,
        isCompleted: true,
        cheerCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return result.map((goal) => ({
      userId: goal.userId,
      nickName: goal.user?.nickName ?? '',
      imageUrl: goal.user?.image?.imageUrl ?? null,
      goalId: goal.goalId,
      isBookmarked: goal.bookmarks.length > 0,
      content: goal.content,
      category: goal.category,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
      isCompleted: goal.isCompleted,
      cheerCount: goal.cheerCount,
    }));
  }

  // 친구 요청 상태 업데이트
  async updateRequestStatus(
    requestId: number,
    status: FriendRequestStatus,
  ): Promise<UpdateFriendDto> {
    return this.prisma.friendRequest.update({
      where: { requestId },
      data: { status },
    });
  }

  async deleteRequest(requestId: number): Promise<UpdateFriendDto> {
    return this.prisma.friendRequest.delete({
      where: { requestId },
    });
  }

  // 친구 목록 불러오기
  async findAllFriendsByUserId(userId: number): Promise<FindFriendDto[]> {
    const results = await this.prisma.friendRequest.findMany({
      where: {
        status: FriendRequestStatus.ACCEPT,
        OR: [{ userId: userId }, { receiverId: userId }],
      },
      select: {
        requestId: true,
        user: {
          select: {
            userId: true,
            nickName: true,
            tier: true,
            email: true,
            image: {
              select: { imageUrl: true },
            },
          },
        },
        receiver: {
          select: {
            userId: true,
            nickName: true,
            tier: true,
            email: true,
            image: {
              select: { imageUrl: true },
            },
          },
        },
      },
    });

    // 요청자/수락자 중 userId가 아닌 쪽을 친구로 반환
    const friends = results.map((req) => {
      const friend = req.user.userId === userId ? req.receiver : req.user;

      return {
        requestId: req.requestId,
        userId: friend.userId,
        nickName: friend.nickName,
        email: friend.email,
        tier: friend.tier,
        imageUrl: friend.image?.imageUrl ?? null,
      };
    });

    return friends;
  }
}
