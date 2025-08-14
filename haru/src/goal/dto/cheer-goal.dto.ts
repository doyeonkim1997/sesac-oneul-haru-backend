import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class CheerGoalDto extends PickType(GoalEntity, ['goalId', 'userId'] as const) {}
