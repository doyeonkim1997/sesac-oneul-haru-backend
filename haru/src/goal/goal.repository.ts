import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { FindGoalDto } from './dto/find-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

import { CheerResponseDto } from './dto/cheer-response.dto';
import { OutputGoalDto } from './dto/output-goal-dto';
import { GoalEntity } from './entity/goal.entity';

@Injectable()
export class GoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 목표 생성
  async createGoal(createGoalDto: CreateGoalDto, userId: number): Promise<CreateGoalDto> {
    const { content, category } = createGoalDto;
    try {
      return await this.prisma.goal.create({
        data: {
          userId: userId,
          content,
          category,
        },
      });
    } catch {
      throw new InternalServerErrorException('목표 생성에 실패했습니다.');
    }
  }

  // 내 목표 조회
  async getGoalById(goalId: number, userId: number): Promise<OutputGoalDto> {
    try {
      const goal = await this.prisma.goal.findFirst({
        where: { goalId: goalId, userId: userId, isDeleted: false },
      });
      if (!goal) throw new NotFoundException('목표를 찾을 수 없습니다.');
      return goal;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('목표 조회 중 오류가 발생했습니다.');
    }
  }

  // 내 목표 전체 조회
  async getAllGoal(userId: number): Promise<FindGoalDto[]> {
    try {
      const result = await this.prisma.goal.findMany({
        where: { userId: userId, isDeleted: false },
        select: {
          user: {
            select: {
              nickName: true,
              image: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },

          bookmarks: {
            where: {
              userId,
            },
            select: {
              bookmarkId: true,
            },
          },
          goalId: true,
          content: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          isCompleted: true,
          cheerCount: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return result.map((goal) => ({
        goalId: goal.goalId,
        nickName: goal.user?.nickName ?? '',
        imageUrl: goal.user?.image?.imageUrl ?? null,
        isBookmarked: goal.bookmarks.length > 0,
        content: goal.content,
        category: goal.category,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        isCompleted: goal.isCompleted,
        cheerCount: goal.cheerCount,
      }));
    } catch {
      throw new InternalServerErrorException('목표 목록 조회에 실패했습니다.');
    }
  }

  // 목표 수정
  async updateGoal(goalId: number, updateGoalDto: UpdateGoalDto): Promise<UpdateGoalDto> {
    const { content, category } = updateGoalDto;
    try {
      // 업데이트 전 존재 여부 확인
      const existingGoal = await this.prisma.goal.findUnique({
        where: { goalId },
      });
      if (!existingGoal) throw new NotFoundException('수정할 목표를 찾을 수 없습니다.');

      return await this.prisma.goal.update({
        where: { goalId: goalId },
        data: {
          content,
          category,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('목표 수정에 실패했습니다.');
    }
  }

  // 완료 여부 변경
  async updateIsCompleted(goalId: number, isCompleted: boolean, content: string, category: string) {
    await this.prisma.goal.update({
      where: {
        goalId,
      },
      data: {
        isCompleted,
        content,
        category,
      },
    });
  }

  // 친구 목록 (변경 없음)
  async getFriendIds(userId: number): Promise<number[]> {
    try {
      const sent = await this.prisma.friendRequest.findMany({
        where: {
          userId,
          status: 'ACCEPTED',
        },
        select: { receiverId: true },
      });

      const received = await this.prisma.friendRequest.findMany({
        where: {
          receiverId: userId,
          status: 'ACCEPTED',
        },
        select: { userId: true },
      });

      const friendIds = [...sent.map((s) => s.receiverId), ...received.map((r) => r.userId)];

      return Array.from(new Set(friendIds));
    } catch {
      throw new InternalServerErrorException('친구 목록 조회에 실패했습니다.');
    }
  }

  // 목표 필터링 (변경 없음)
  // async goalFilter(filterGoalDto: FilterGoalDto): Promise<FindGoalDto[]> {
  //   try {
  //     const { userId, isCompleted } = filterGoalDto;

  //     let userIds: number[] = [userId];

  //     if (isCompleted === 'all') {
  //       const friendIds = await this.getFriendIds(userId);
  //       userIds = [...userIds, ...friendIds];
  //     }

  //     const whereCondition: any = {
  //       userId: { in: userIds },
  //       isDeleted: false,
  //     };

  //     if (isCompleted !== 'all') {
  //       whereCondition.isCompleted = isCompleted;
  //     }

  //     return await this.prisma.goal.findMany({
  //       where: whereCondition,
  //       orderBy: { createdAt: 'desc' },
  //     });
  //   } catch {
  //     throw new InternalServerErrorException('목표 필터링에 실패했습니다.');
  //   }
  // }

  // 목표 삭제 (소프트 딜리트) (변경 없음)
  async deleteGoal(goalId: number, userId: number): Promise<boolean> {
    try {
      const goal = await this.prisma.goal.findFirst({
        where: { goalId, userId, isDeleted: false },
      });

      if (!goal) return false;

      await this.prisma.goal.update({
        where: { goalId },
        data: { isDeleted: true },
      });

      return true;
    } catch {
      throw new InternalServerErrorException('목표 삭제에 실패했습니다.');
    }
  }

  // goalId로 목표 조회
  async findGoalByGoalId(goalId: number): Promise<GoalEntity | null> {
    return await this.prisma.goal.findFirst({
      where: {
        goalId,
      },
    });
  }

  // goalId로 완료 상태 업데이트를 위한 정보 조회
  async findToggleInfoByGoalId(goalId: number): Promise<{
    content: string;
    category: string;
    isCompleted: boolean;
  } | null> {
    return await this.prisma.goal.findFirst({
      where: {
        goalId,
      },
      select: {
        category: true,
        content: true,
        isCompleted: true,
      },
    });
  }

  // userId로 사용자 조회
  async findUserByUserId(userId: number) {
    return await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });
  }

  // 응원 증가
  async cheerGoal(goalId: number): Promise<CheerResponseDto> {
    try {
      const updatedGoal = await this.prisma.goal.update({
        where: { goalId },
        data: { cheerCount: { increment: 1 } },
        select: { goalId: true, cheerCount: true },
      });
      return updatedGoal;
    } catch {
      throw new NotFoundException('목표를 찾을 수 없습니다.');
    }
  }

  // 응원 취소
  async cancelCheerGoal(goalId: number): Promise<CheerResponseDto> {
    try {
      const goal = await this.prisma.goal.findUnique({
        where: { goalId },
        select: { cheerCount: true },
      });
      if (!goal) throw new NotFoundException('목표를 찾을 수 없습니다.');

      const newCount = goal.cheerCount > 0 ? goal.cheerCount - 1 : 0;

      const updatedGoal = await this.prisma.goal.update({
        where: { goalId },
        data: { cheerCount: newCount },
        select: { goalId: true, cheerCount: true },
      });
      return updatedGoal;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('응원 취소에 실패했습니다.');
    }
  }

  // 전체 응원 누적 수
  async totalCheerCount(userId: number): Promise<number> {
    try {
      const result = await this.prisma.goal.aggregate({
        _sum: { cheerCount: true },
        where: { userId, isDeleted: false },
      });
      return result._sum.cheerCount ?? 0;
    } catch {
      throw new InternalServerErrorException('전체 응원 누적 수 조회에 실패했습니다.');
    }
  }

  // 오늘 응원 누적 수
  async todayCheerCount(userId: number, todayStart: Date, todayEnd: Date): Promise<number> {
    try {
      const result = await this.prisma.goal.aggregate({
        _sum: { cheerCount: true },
        where: {
          userId,
          createdAt: { gte: todayStart, lte: todayEnd },
          isDeleted: false,
        },
      });
      return result._sum.cheerCount ?? 0;
    } catch {
      throw new InternalServerErrorException('오늘 응원 누적 수 조회에 실패했습니다.');
    }
  }

  // 목표 미완료자 찾기
  async findIncompleteGoal(todayStart: Date, todayEnd: Date) {
    return await this.prisma.goal.findMany({
      where: {
        isCompleted: false,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        user: true,
      },
    });
  }

  // 자정 금일 응원 수 초기화
  async resetCount(todayStart: Date, todayEnd: Date): Promise<void> {
    await this.prisma.goal.updateMany({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      data: {
        cheerCount: 0,
      },
    });
  }
}
