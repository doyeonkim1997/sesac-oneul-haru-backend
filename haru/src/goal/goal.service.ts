import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { validateLogin } from 'src/auth/validator/validateLogin';
import { UserEntity } from 'src/user/entity/user.entity';
import { CheerResponseDto } from './dto/cheer-response.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { FilterGoalDto } from './dto/filter-goal.dto';
import { FindGoalDto } from './dto/find-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalRepository } from './goal.repository';

@Injectable()
export class GoalService {
  private logger = new Logger('GoalService');
  constructor(private readonly goalRepository: GoalRepository) {}

  // 목표 생성 (변경 없음)
  async createGoal(createGoalDto: CreateGoalDto, userId: number): Promise<CreateGoalDto | null> {
    const findUser = await this.goalRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('유효하지 않는 사용자입니다.');
    }
    return await this.goalRepository.createGoal(createGoalDto, userId);
  }

  // 특정 사용자 목표 조회 (변경 없음)
  async getGoalById(goalId: number, userId: number): Promise<FindGoalDto> {
    const findUser = await this.goalRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('유효하지 않는 사용자입니다.');
    }

    const goal = await this.goalRepository.getGoalById(goalId, userId);
    if (!goal) throw new NotFoundException('해당 목표를 찾을 수 없습니다.');
    return goal;
  }

  // 사용자 전체 목표 조회 (변경 없음)
  async getAllGoals(userId: number, user: UserEntity): Promise<FindGoalDto[]> {
    validateLogin(userId, user.userId);
    return await this.goalRepository.getAllGoal(userId);
  }

  // 필터링 (변경 없음)
  async goalFilter(
    filterGoalDto: FilterGoalDto,
    userId: number,
    user: UserEntity,
  ): Promise<FindGoalDto[]> {
    // 로그인 검증
    validateLogin(userId, user.userId);
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

    this.logger.debug('목표 수정 GoalService 종료');
    return await this.goalRepository.updateGoal(goalId, updateGoalDto);
  }

  // 목표 삭제 (변경 없음)
  async deleteGoal(goalId: number, userId: number): Promise<void> {
    const goal = await this.goalRepository.findGoalByGoalId(goalId);

    if (!goal) {
      throw new NotFoundException('삭제할 목표가 존재하지 않습니다.');
    }

    // 로그인 검증
    validateLogin(goal.userId, userId);

    const deleted = await this.goalRepository.deleteGoal(goalId, userId);
    if (!deleted) throw new NotFoundException('삭제할 목표가 존재하지 않습니다.');
  }

  // 응원 증가
  async cheerGoal(goalId: number, userId: number): Promise<CheerResponseDto | null> {
    const findUser = await this.goalRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('유효하지 않는 사용자입니다.');
    }

    const goal = await this.goalRepository.findGoalByGoalId(goalId);

    if (!goal) {
      throw new NotFoundException('응원할 목표가 존재하지 않습니다.');
    }

    if (goal.userId === userId) {
      throw new BadRequestException('자신의 목표는 응원할 수 없습니다.');
    }

    return this.goalRepository.cheerGoal(goalId);
  }

  // 목표 완료 / 미완료 상태 토글
  async toggleIsCompleted(goalId: number): Promise<string> {
    const findGoal = await this.goalRepository.findToggleInfoByGoalId(goalId);

    this.logger.debug(`완료 상태 토글을 위한 service  시작 `);

    if (!findGoal) {
      throw new NotFoundException('목표를 찾을 수 없습니다.');
    }

    if (findGoal.isCompleted === true) {
      await this.goalRepository.updateIsCompleted(
        goalId,
        false,
        findGoal.content,
        findGoal.category,
      );
      return '미완료 변경';
    }

    if (findGoal.isCompleted === false) {
      await this.goalRepository.updateIsCompleted(
        goalId,
        true,
        findGoal.content,
        findGoal.category,
      );
      return '완료 변경';
    }

    return '완료 상태 변경';
  }

  // 응원 취소
  async cancelCheerGoal(goalId: number, userId: number): Promise<CheerResponseDto> {
    const findUser = await this.goalRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('유효하지 않는 사용자입니다.');
    }

    const goal = await this.goalRepository.findGoalByGoalId(goalId);

    if (!goal) {
      throw new NotFoundException('응원할 목표가 존재하지 않습니다.');
    }

    if (goal.userId === userId) {
      throw new BadRequestException('자신의 목표는 응원할 수 없습니다.');
    }

    return this.goalRepository.cancelCheerGoal(goalId);
  }

  // 전체 응원 누적 수
  async totalCheerCount(userId: number): Promise<number> {
    const findUser = await this.goalRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('유효하지 않는 사용자입니다.');
    }
    return this.goalRepository.totalCheerCount(userId);
  }

  // 오늘 응원 누적 수
  async todayCheerCount(userId: number): Promise<number> {
    const findUser = await this.goalRepository.findUserByUserId(userId);

    if (!findUser) {
      throw new NotFoundException('유효하지 않는 사용자입니다.');
    }
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    return this.goalRepository.todayCheerCount(userId, todayStart, todayEnd);
  }
}
