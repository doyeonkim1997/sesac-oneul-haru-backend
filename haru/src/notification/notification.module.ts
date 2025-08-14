import { Module } from '@nestjs/common';
import { GoalRepository } from 'src/goal/goal.repository';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, GoalRepository],
})
export class NotificationModule {}
