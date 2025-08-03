import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GoalRepository } from '../goal/goal.repository';
import { Response } from 'express';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly goalRepository: GoalRepository) {}

  // 목표 날짜 설정
  getTodayRange() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    return { todayStart, todayEnd };
  }

  //sse
  private clients: Response[] = [];

  addClient(res: Response) {
    this.clients.push(res);
  }

  removeClient(res: Response) {
    this.clients = this.clients.filter((client) => client !== res);
  }

  sendNotification(msg: string) {
    const data = `data: ${msg}\n\n`;
    this.clients.forEach((client) => client.write(data));
  }

  // 자정되기 1시가전 알림
  // @Cron('0 0 23 * * * ')
  @Cron('*/10 * * * * *')
  async handleReminderAlert() {
    const { todayStart, todayEnd } = this.getTodayRange();

    const inCompleteGoals = await this.goalRepository.findIncompleteGoal(todayStart, todayEnd);
    this.logger
      .log(`경고! 목표 종료까지 1시간 남았습니다. 미완료 목표${inCompleteGoals.length}개 발견
      남은 시간까지 열심히 해봐요!`);

    if (inCompleteGoals.length > 0) {
      this.sendNotification(
        `사용자님의 ${inCompleteGoals.length}개의 목표가 아직 완료되지 않았어요!`,
      );
    }
  }

  @Cron('*/10 * * * * *')
  async resetCheerCount() {
    const { todayStart, todayEnd } = this.getTodayRange();

    // await this.goalRepository.resetCount(todayStart, todayEnd);

    this.logger.log(`자정이 되어 오늘 생성된 목표의 응원수가 초기화 됩니다.`);
  }
}
