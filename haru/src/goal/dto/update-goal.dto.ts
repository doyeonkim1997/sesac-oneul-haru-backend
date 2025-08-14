import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class UpdateGoalDto extends PickType(GoalEntity, ['content', 'category'] as const) {}
