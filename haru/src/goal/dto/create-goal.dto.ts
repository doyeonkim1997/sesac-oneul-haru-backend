import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class CreateGoalDto extends PickType(GoalEntity, [
  'title',
  'content',
  'category',
  'isCompleted',
  'isDeleted',
] as const) {}
