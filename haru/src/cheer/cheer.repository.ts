import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { FindCheerDto } from './dto/find-cheer.dto';

@Injectable()
export class CheerRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 유저id 찾기
  async findUserIdByUserId(userId: number): Promise<{ userId: number } | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
      select: {
        userId: true,
      },
    });

    return user;
  }

  // 목표 id 찾기
  async findGoalByGoalId(goalId: number): Promise<{ userId: number; goalId: number } | null> {
    const goal = await this.prisma.goal.findFirst({
      where: {
        goalId,
      },
      select: {
        userId: true,
        goalId: true,
      },
    });

    return goal;
  }

  // 현재 응원 확인
  async findCurrentCheer(goalId: number, userId: number): Promise<FindCheerDto | null> {
    const cheer = await this.prisma.cheer.findUnique({
      where: {
        userId_goalId: {
          userId: userId,
          goalId: goalId,
        },
      },
    });
    return cheer;
  }

  // 응원 추가
  async createCheer(goalId: number, userId: number): Promise<void> {
    await this.prisma.cheer.create({
      data: {
        userId,
        goalId,
      },
    });
  }

  // 응원 삭제
  async deleteCheer(goalId: number, userId: number): Promise<void> {
    await this.prisma.cheer.delete({
      where: {
        userId_goalId: {
          userId: userId,
          goalId: goalId,
        },
      },
    });
  }

  // 지금까지 받은 전체 응원 수
  async totalCheerCount(userId: number): Promise<number> {
    const totalCount = await this.prisma.cheer.count({
      where: {
        goal: {
          userId: userId, // 해당 사용자가 작성한 목표
        },
        userId: {
          not: userId, // 응원한 사람이 본인이 아닌 경우
        },
      },
    });
    return totalCount;
  }

  // 오늘 전체 응원 수
  async todayCheerCount(userId: number, start: Date, end: Date): Promise<number> {
    const todayCount = await this.prisma.cheer.count({
      where: {
        goal: {
          userId: userId,
        },
        userId: {
          not: userId,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
    return todayCount;
  }

  // 내가 응원한 목표의 id 목록 가져오기
  async findAllGoalIds(userId: number): Promise<number[]> {
    const cheers = await this.prisma.cheer.findMany({
      where: {
        userId,
      },
      select: {
        goalId: true,
      },
    });

    return cheers.map((c) => c.goalId);
  }
}
