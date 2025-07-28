import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalRepository } from './goal.repository';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { FindGoalDto } from './dto/find-goal.dto';
import { FindGoalFilterDto } from './dto/find-goal-filter.dto';

@Injectable()
export class GoalService {
  constructor(private readonly goalRepository: GoalRepository) {}

  // 목표 생성 (변경 없음)
  async createGoal(createGoalDto: CreateGoalDto, userId: number): Promise<CreateGoalDto | null> {
    return await this.goalRepository.createGoal(createGoalDto, userId);
  }

  // 특정 사용자 목표 조회 (변경 없음)
  async getGoalById(goalId: number, userId: number): Promise<FindGoalDto> {
    const goal = await this.goalRepository.getGoalById(goalId, userId);
    if (!goal) throw new NotFoundException('해당 목표를 찾을 수 없습니다.');
    return goal;
  }

  // 사용자 전체 목표 조회 (변경 없음)
  async getAllGoals(userId: number): Promise<FindGoalDto[]> {
    return await this.goalRepository.getAllGoal(userId);
  }

  // 필터링 (변경 없음)
  async goalFilter(filerDto: FindGoalFilterDto): Promise<FindGoalDto[]> {
    return await this.goalRepository.goalFilter(filerDto);
  }

  // 목표 수정 (userId를 통한 소유권 검증 로직은 유지)
  async updateGoal(
    goalId: number,
    updateGoalDto: UpdateGoalDto,
    userId: number,
  ): Promise<UpdateGoalDto> {
    const existingGoal = await this.goalRepository.getGoalById(goalId, userId);
    if (!existingGoal) {
      throw new NotFoundException('수정 권한이 없는 목표이거나 목표를 찾을 수 없습니다.');
    }

    return await this.goalRepository.updateGoal(goalId, updateGoalDto);
  }

  // 목표 삭제 (변경 없음)
  async deleteGoal(goalId: number, userId: number): Promise<void> {
    const deleted = await this.goalRepository.deleteGoal(goalId, userId);
    if (!deleted) throw new NotFoundException('삭제할 목표가 존재하지 않습니다.');
  }
}
