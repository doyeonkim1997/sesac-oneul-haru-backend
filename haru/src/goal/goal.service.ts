import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalRepository } from './goalRepository';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService {
  constructor(private readonly goalRepository: GoalRepository) {}

  async createGoal(createGoalDto: CreateGoalDto) {
    return await this.goalRepository.createGoal(createGoalDto);
  }

  async getGoalsByUser(userId: number) {
    return await this.goalRepository.findGoalsByUserId(userId);
  }

  async getGoalById(goalId: number) {
    const goal = await this.goalRepository.findGoalById(goalId);
    if (!goal || goal.isDeleted) {
      throw new NotFoundException('Goal not found');
    }
    return goal;
  }

  async updateGoal(goalId: number, updateGoalDto: UpdateGoalDto) {
    // 존재 및 삭제 여부 확인
    await this.getGoalById(goalId);
    return await this.goalRepository.updateGoal(goalId, updateGoalDto);
  }

  async deleteGoal(goalId: number) {
    // 존재 및 삭제 여부 확인
    await this.getGoalById(goalId);
    return await this.goalRepository.softDeleteGoal(goalId);
  }
}
