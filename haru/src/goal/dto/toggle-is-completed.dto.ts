import { ApiProperty } from '@nestjs/swagger';

export class ToggleIsCompletedDto {
  @ApiProperty({ example: '운동하기' })
  content: string;

  @ApiProperty({ example: 'HEALTH' })
  category: string;

  @ApiProperty({ example: false })
  isCompleted: boolean;
}
