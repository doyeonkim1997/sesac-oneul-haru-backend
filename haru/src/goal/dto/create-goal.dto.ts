import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class CreateGoalDto extends PickType(GoalEntity, [
  'userId',
  'title',
  'content',
  'category',
] as const) {}
