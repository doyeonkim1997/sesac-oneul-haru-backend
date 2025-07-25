import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 목표 생성
  async createGoal(createGoalDto: CreateGoalDto): Promise<CreateGoalDto> {
    return await this.prisma.goal.create({
      data: createGoalDto,
    });
  }

  // userId로 목표 리스트 조회 (삭제되지 않은 목표만)
  async findGoalsByUserId(userId: number) {
    return await this.prisma.goal.findMany({
      select: {
        goalId: true,
        userId: true,
        title: true,
        content: true,
        category: true,
        isCompleted: true,
        isDeleted: true,
        cheerCount: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // goalId로 단일 목표 조회
  async findGoalById(goalId: number) {
    return await this.prisma.goal.findUnique({
      select: {
        goalId: true,
        userId: true,
        title: true,
        content: true,
        category: true,
        isCompleted: true,
        isDeleted: true,
        cheerCount: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        goalId,
      },
    });
  }
  // 목표 수정
  async updateGoal(goalId: number, updateGoalDto: UpdateGoalDto) {
    return await this.prisma.goal.update({
      data: updateGoalDto,
      where: {
        goalId,
      },
    });
  }
  // 목표 소프트 삭제
  async softDeleteGoal(goalId: number) {
    return await this.prisma.goal.update({
      data: { isDeleted: true },
      where: { goalId },
    });
  }
}
