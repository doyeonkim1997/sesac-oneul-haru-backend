import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class OutputGoalDto extends PickType(GoalEntity, ['goalId', 'userId', 'content'] as const) {}
