import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class CreateGoalDto extends PickType(GoalEntity, ['content', 'category'] as const) {}
