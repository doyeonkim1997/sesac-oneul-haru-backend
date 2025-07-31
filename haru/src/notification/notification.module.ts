import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { GoalRepository } from 'src/goal/goal.repository';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, GoalRepository],
})
export class NotificationModule {}
