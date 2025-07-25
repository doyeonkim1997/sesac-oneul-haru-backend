import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class UpdateGoalDto extends PickType(GoalEntity, [
  'title',
  'content',
  'category',
  'isCompleted',
] as const) {}
