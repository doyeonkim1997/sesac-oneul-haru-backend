import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { FindGoalDto } from './dto/find-goal.dto';
import { FindGoalFilterDto } from './dto/find-goal-filter.dto';

@Injectable()
export class GoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 목표 생성
  async createGoal(createGoalDto: CreateGoalDto): Promise<CreateGoalDto | null> {
    return await this.prisma.goal.create({
      data: {
        title: createGoalDto.title,
        content: createGoalDto.content,
        category: createGoalDto.category,
      },
    });
  }

  // 내 목표 조회
  async getGoalById(goalId: number, userId: number): Promise<FindGoalDto | null> {
    return await this.prisma.goal.findFirst({
      where: { goalId: goalId, userId: userId, isDeleted: false },
    });
  }

  // 내 목표 조회
  async getAllGoal(userId: number): Promise<FindGoalDto[]> {
    return await this.prisma.goal.findMany({
      where: { userId: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 목표 수정
  async updateGoal(goalId: number, updateGoalDto: UpdateGoalDto): Promise<UpdateGoalDto> {
    return await this.prisma.goal.update({
      where: { goalId: goalId },
      data: {
        title: updateGoalDto.title,
        content: updateGoalDto.content,
        category: updateGoalDto.category,
        isCompleted: updateGoalDto.isCompleted,
      },
    });
  }

  // 친구 목록
  async getFriendIds(userId: number): Promise<number[]> {
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

    const freindIds = [...sent.map((s) => s.receiverId), ...received.map((r) => r.userId)];

    return Array.from(new Set(freindIds));
  }

  // 목표 필터링
  async goalFilter(filerDto: FindGoalFilterDto): Promise<FindGoalDto[]> {
    const { userId, isCompleted } = filerDto;

    let userIds: number[] = [userId];

    if (isCompleted === 'all') {
      const friendIds = await this.getFriendIds(userId);
      userIds = [...userIds, ...friendIds];
    }

    const whereCondition: any = {
      userId: { in: userIds },
      isDeleted: false,
    };

    if (isCompleted !== 'all') {
      whereCondition.isCompleted = isCompleted;
    }

    return this.prisma.goal.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });
  }
  // 목표 삭제 (소프트 딜리트)
  async deleteGoal(goalId: number, userId: number): Promise<boolean> {
    const goal = await this.prisma.goal.findFirst({
      where: { goalId, userId, isDeleted: false },
    });

    if (!goal) return false;

    await this.prisma.goal.update({
      where: { goalId },
      data: { isDeleted: true },
    });

    return true;
  }
}
