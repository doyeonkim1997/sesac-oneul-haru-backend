import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CheerRepository } from './cheer.repository';

@Injectable()
export class CheerService {
  private logger = new Logger('CheerService');
  constructor(private readonly cheerRepository: CheerRepository) {}

  // 응원 토글
  async toggleCheer(goalId: number, userId: number): Promise<string> {
    const findUserId = await this.cheerRepository.findUserIdByUserId(userId);

    if (!findUserId) {
      throw new NotFoundException('유효하지 않는 사용자입니다.');
    }

    const findGoal = await this.cheerRepository.findGoalByGoalId(goalId);
    if (!findGoal) {
      throw new NotFoundException('응원할 목표가 존재하지 않습니다.');
    }

    if (findGoal.userId === userId) {
      throw new BadRequestException('자신의 목표는 응원할 수 없습니다.');
    }

    const findCheer = await this.cheerRepository.findCurrentCheer(goalId, userId);

    if (findCheer) {
      await this.cheerRepository.deleteCheer(goalId, userId);
      return '응원 삭제';
    } else {
      await this.cheerRepository.createCheer(goalId, userId);
      return '응원 추가';
    }
  }

  // 전체 응원 수
  async totalCheerCount(userId: number): Promise<number> {
    return await this.cheerRepository.totalCheerCount(userId);
  }

  // 오늘 전체 응원 수
  async todayCheerCount(userId: number): Promise<number> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return await this.cheerRepository.todayCheerCount(userId, start, end);
  }
}
