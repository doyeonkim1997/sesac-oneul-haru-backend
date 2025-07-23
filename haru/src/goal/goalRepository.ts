import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { Goal, Prisma } from '@prisma/client';

@Injectable()
export class GoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 목표 생성
  async createGoal(data: Prisma.GoalCreateInput): Promise<Goal> {
    return await this.prisma.goal.create({
      data,
    });
  }

  // 목표 조회
  async findById(goalId: number): Promise<Goal | null> {
    return await this.prisma.goal.findUnique({
      where: { goalId },
    });
  }

  // 목표 목록 조회
  async findAll(userId: number): Promise<Goal[]> {
    return await this.prisma.goal.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 목표 업데이트
  async updateGoal(goalId: number, data: Prisma.GoalUpdateInput): Promise<Goal> {
    return await this.prisma.goal.update({
      where: { goalId },
      data,
    });
  }

  // 목표 소프트 삭제
  async softDeleteGoal(goalId: number) {
    return await this.prisma.goal.update({
      where: { goalId },
      data: { isDeleted: true },
    });
  }

  // 목표 삭제
  async deleteGoal(goalId: number) {
    return await this.prisma.goal.delete({
      where: { goalId },
    });
  }
}
