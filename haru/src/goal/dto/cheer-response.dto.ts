import { PickType } from '@nestjs/swagger';
import { GoalEntity } from '../entity/goal.entity';

export class CheerResponseDto extends PickType(GoalEntity, ['goalId', 'cheerCount'] as const) {}
