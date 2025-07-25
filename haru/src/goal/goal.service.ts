import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalRepository } from './goalRepository';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { FindGoalDto } from './dto/find-goal.dto';

@Injectable()
export class GoalService {
  constructor(private readonly goalRepository: GoalRepository) {}

  // 목표 생성
  async createGoal(createGoalDto: CreateGoalDto): Promise<CreateGoalDto | null> {
    return await this.goalRepository.createGoal(createGoalDto);
  }

  // 특정 사용자 목표 조회
  async getGoalById(goalId: number, userId: number): Promise<FindGoalDto> {
    const goal = await this.goalRepository.getGoalById(goalId, userId);
    if (!goal) throw new NotFoundException('해당 목표를 찾을 수 없습니다.');
    return goal;
  }

  // 사용자 전체 목표 조회
  async getAllGoals(userId: number): Promise<FindGoalDto[]> {
    return await this.goalRepository.getAllGoal(userId);
  }
  // 목표 수정
  async updateGoal(goalId: number, updateGoalDto: UpdateGoalDto): Promise<UpdateGoalDto> {
    return await this.goalRepository.updateGoal(goalId, updateGoalDto);
  }

  // 목표 삭제
  async deleteGoal(goalId: number, userId: number): Promise<void> {
    const deleted = await this.goalRepository.deleteGoal(goalId, userId);
    if (!deleted) throw new NotFoundException('삭제할 목표가 존재하지 않습니다.');
  }
}
