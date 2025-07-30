import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalRepository } from './goal.repository';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { FindGoalDto } from './dto/find-goal.dto';
import { FilterGoalDto } from './dto/filter-goal.dto';
import { CheerResponseDto } from './dto/cheer-response.dto';

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
  async goalFilter(filterGoalDto: FilterGoalDto): Promise<FindGoalDto[]> {
    return await this.goalRepository.goalFilter(filterGoalDto);
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

  // 응원 증가
  async cheerGoal(goalId: number): Promise<CheerResponseDto | null> {
    return this.goalRepository.cheerGoal(goalId);
  }

  // 응원 취소
  async cancelCheerGoal(goalId: number): Promise<CheerResponseDto> {
    return this.goalRepository.cancelCheerGoal(goalId);
  }

  // 전체 응원 누적 수
  async totalCheerCount(userId: number): Promise<number> {
    return this.goalRepository.totalCheerCount(userId);
  }

  // 오늘 응원 누적 수
  async todayCheerCount(userId: number): Promise<number> {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    return this.goalRepository.todayCheerCount(userId, todayStart, todayEnd);
  }
}
