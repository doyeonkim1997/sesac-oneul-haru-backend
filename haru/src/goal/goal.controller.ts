import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindGoalDto } from './dto/find-goal.dto';
import { FindGoalFilterDto } from './dto/find-goal-filter.dto';
@ApiTags('Goal')
@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  // 목표 생성
  @Post()
  @ApiOperation({ summary: '목표 생성', description: '사용자 ID를 통해 목표를 생성합니다.' })
  @ApiResponse({ status: 201, description: '목표 생성 성공', type: CreateGoalDto })
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    const dtoWithUser = { ...createGoalDto, userId };
    return await this.goalService.createGoal(dtoWithUser);
  }

  // 사용자 특정 목표 조회
  @Get(':goalId')
  @ApiOperation({
    summary: '특정 사용자 목표 조회',
    description: '목표 ID와 사용자 ID를 통해 목표를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '목표 조회 성공', type: FindGoalDto })
  async findOne(
    @Param('goalId', ParseIntPipe) goalId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<FindGoalDto> {
    return await this.goalService.getGoalById(goalId, userId);
  }

  // 사용자 전체 목표 조회
  @Get()
  @ApiOperation({ summary: '모든 사용자 목표 조회' })
  @ApiResponse({ status: 200, description: '목표 목록 조회 성공', type: [FindGoalDto] })
  async findAll(@Query('userId', ParseIntPipe) userId: number): Promise<FindGoalDto[]> {
    return await this.goalService.getAllGoals(userId);
  }

  // 필터링
  @Get('filter')
  @ApiOperation({ summary: '목표 목록 필터링' })
  @ApiResponse({ status: 200, description: '전체/완료/미완료', type: [FindGoalDto] })
  async getFilteredGoals(
    @Query('userId') userId: number,
    @Query('status') status: 'all' | 'true' | 'false' = 'all',
  ) {
    const filterDto: FindGoalFilterDto = {
      userId,
      isCompleted: status === 'all' ? 'all' : status === 'true',
    };
    return this.goalService.goalFilter(filterDto);
  }

  // 사용자 목표 수정
  @Patch(':goalId')
  @ApiOperation({ summary: '목표 수정' })
  @ApiResponse({ status: 200, description: '목표 수정 성공', type: UpdateGoalDto })
  async update(
    @Param('goalId', ParseIntPipe) goalId: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return await this.goalService.updateGoal(goalId, updateGoalDto);
  }

  // 삭제(소프트 딜리트)
  @Delete(':goalId')
  @ApiOperation({ summary: '목표 삭제 (소프트 딜리트)' })
  @ApiResponse({ status: 200, description: '목표 삭제 성공' })
  async remove(
    @Param('goalId', ParseIntPipe) goalId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return await this.goalService.deleteGoal(goalId, userId);
  }
}
