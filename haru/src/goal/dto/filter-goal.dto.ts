import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber } from 'class-validator';

export class FilterGoalDto {
  @ApiProperty({ description: '유저 ID', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: '목표 완료 여부 필터링 (all | true | false)',
    example: 'all',
  })
  @IsIn(['all', true, false])
  isCompleted: 'all' | true | false;
}
