import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { FindGoalDto } from './dto/find-goal.dto';

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

  // 특정 사용자 목표 조회
  async getGoalById(goalId: number, userId: number): Promise<FindGoalDto | null> {
    return await this.prisma.goal.findFirst({
      where: { goalId: goalId, userId: userId, isDeleted: false },
    });
  }

  // 모든 사용자 목표 조회
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
