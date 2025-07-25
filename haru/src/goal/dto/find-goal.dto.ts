import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class FindGoalDto extends PickType(GoalEntity, ['title', 'category'] as const) {}
