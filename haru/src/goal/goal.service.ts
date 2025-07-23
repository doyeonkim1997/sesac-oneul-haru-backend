import { Injectable } from '@nestjs/common';
import { GoalRepository } from './goalRepository';
import { Prisma, Goal } from '@prisma/client';

@Injectable()
export class GoalService {
  constructor(private readonly goalRepository: GoalRepository) {}

  // 목표 생성
  async createGoal(data: Prisma.GoalCreateInput): Promise<Goal> {
    return await this.goalRepository.createGoal(data);
  }

  // 특정 목표 조회
  async getGoalById(goalId: number): Promise<Goal | null> {
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }
    return goal;
  }

  // 모든 목표 목록 조회
  async getAllGoal(userId: number): Promise<Goal[]> {
    return await this.goalRepository.findAll(userId);
  }

  // 목표 업데이트
  async updateGoal(goalId: number, data: Prisma.GoalUpdateInput): Promise<Goal> {
    await this.getGoalById(goalId);
    return this.goalRepository.updateGoal(goalId, data);
  }

  // 목표 소프트 삭제
  async softDeleteGoal(goalId: number) {
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }
    return await this.goalRepository.softDeleteGoal(goalId);
  }

  // 목표 삭제
  async deleteGoal(goalId: number) {
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }
    await this.getGoalById(goalId);
    return this.goalRepository.deleteGoal(goalId);
  }
}
