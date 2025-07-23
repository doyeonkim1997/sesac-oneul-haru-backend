import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoalEntity } from './entity/goal.entity';

@ApiTags('Goal')
@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @ApiOperation({ summary: '새 목표 생성' })
  @ApiResponse({ status: 201, description: '목표 생성 성공', type: GoalEntity })
  async create(@Body() createGoalDto: CreateGoalDto) {
    return await this.goalService.createGoal(createGoalDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '유저 ID로 목표 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '목표 리스트 조회 성공',
    type: [GoalEntity],
  })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.goalService.getGoalsByUser(userId);
  }

  @Get(':goalId')
  @ApiOperation({ summary: '목표 ID로 단일 목표 조회' })
  @ApiResponse({ status: 200, description: '목표 조회 성공', type: GoalEntity })
  async findOne(@Param('goalId', ParseIntPipe) goalId: number) {
    return await this.goalService.getGoalById(goalId);
  }

  @Patch(':goalId')
  @ApiOperation({ summary: '목표 수정' })
  @ApiResponse({ status: 200, description: '목표 수정 성공', type: GoalEntity })
  async update(
    @Param('goalId', ParseIntPipe) goalId: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return await this.goalService.updateGoal(goalId, updateGoalDto);
  }

  @Delete(':goalId')
  @ApiOperation({ summary: '목표 삭제 (소프트 딜리트)' })
  @ApiResponse({ status: 200, description: '목표 삭제 성공', type: GoalEntity })
  async remove(@Param('goalId', ParseIntPipe) goalId: number) {
    return await this.goalService.deleteGoal(goalId);
  }
}
