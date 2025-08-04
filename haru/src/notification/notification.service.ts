import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Response } from 'express';
import { GoalRepository } from '../goal/goal.repository';

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
  private clients: { userId: number; res: Response }[] = [];

  addClient(userId: number, res: Response) {
    this.clients.push({ userId, res });
  }

  removeClient(res: Response) {
    this.clients = this.clients.filter((client) => client.res !== res);
  }

  sendNotification(msg: string) {
    const data = `data: ${msg}\n\n`;
    this.clients.forEach((client) => client.res.write(data));
  }

  // 자정되기 1시가전 알림
  // @Cron('0 0 23 * * * ')
  @Cron('*/10 * * * * *')
  async handleReminderAlert() {
    const { todayStart, todayEnd } = this.getTodayRange();

    for (const client of this.clients) {
      const userId = client.userId;

      const incompleteGoals = await this.goalRepository.findIncompleteGoal(
        userId,
        todayStart,
        todayEnd,
      );
      const count = incompleteGoals.length;

      if (count > 0) {
        const msg = `오늘 완료하지 않은 목표가 ${count}개 있습니다! 마무리할 시간이에요!`;
        client.res.write(`data: ${msg}\n\n`);
      }
    }
  }
}
