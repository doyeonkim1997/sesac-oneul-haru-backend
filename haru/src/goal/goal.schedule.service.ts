import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GoalRepository } from './goal.repository';

@Injectable()
export class GoalScheduleService {
  private readonly logger = new Logger(GoalScheduleService.name);

  constructor(private readonly goalRepository: GoalRepository) {}

  @Cron('0***')
  handleCron() {
    this.logger.debug('1시간 마다 올림');
  }

  // GO-06 자정 목표 처리:
  @Cron('0****')
  handleCron2() {
    this.logger.debug('1시간 마다 올림');
  }
}
