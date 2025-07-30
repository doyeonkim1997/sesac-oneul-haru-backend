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
  UseGuards,
  Req,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindGoalDto } from './dto/find-goal.dto';
import { FilterGoalDto } from './dto/filter-goal.dto';
import { CheerGoalDto } from './dto/cheer-goal.dto';
import { CheerResponseDto } from './dto/cheer-response.dto';

@ApiTags('Goal')
@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  // 목표 생성
  @ApiOperation({
    summary: '목표 생성',
    description: '목표를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '목표 생성 성공',
    type: CreateGoalDto,
  })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createGoalDto: CreateGoalDto, @Request() req) {
    const userId = req.user.userId;
    return await this.goalService.createGoal(createGoalDto, userId);
  }

  // 사용자 특정 목표 조회
  @ApiOperation({
    summary: '특정 사용자 목표 조회',
    description: '목표 ID와 사용자 ID를 통해 목표를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '목표 조회 성공',
    type: FindGoalDto,
  })
  @Get(':goalId')
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @Param('goalId', ParseIntPipe) goalId: number,
    @Query('userId', ParseIntPipe) userId: number, // 이 부분은 인증을 강화하면 req.user.userId로 대체될 수 있습니다.
  ): Promise<FindGoalDto> {
    return await this.goalService.getGoalById(goalId, userId);
  }

  // 사용자 전체 목표 조회
  @ApiOperation({
    summary: '모든 사용자 목표 조회',
    description: '모든 사용자 목표 조회',
  })
  @ApiResponse({
    status: 200,
    description: '목표 목록 조회 성공',
    type: FindGoalDto,
  })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query('userId', ParseIntPipe) userId: number): Promise<FindGoalDto[]> {
    return await this.goalService.getAllGoals(userId);
  }

  // 필터링
  @ApiOperation({
    summary: '목표 목록 필터링',
    description: '목표 목록 필터링',
  })
  @ApiResponse({
    status: 200,
    description: '전체/완료/미완료',
    type: FilterGoalDto,
  })
  @Get('filter')
  @UseGuards(AuthGuard('jwt'))
  async getFilteredGoals(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('status') status: 'all' | 'true' | 'false' = 'all',
  ) {
    const filterDto: FilterGoalDto = {
      userId,
      isCompleted: status === 'true' ? true : status === 'false' ? false : 'all',
    };
    return this.goalService.goalFilter(filterDto);
  }

  // 사용자 목표 수정
  @ApiOperation({
    summary: '목표 수정',
    description: '목표 수정',
  })
  @ApiResponse({
    status: 200,
    description: '목표 수정 성공',
    type: String,
  })
  @Patch(':goalId')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('goalId', ParseIntPipe) goalId: number,
    @Body() updateGoalDto: UpdateGoalDto,
    @Request() req,
  ) {
    const userId = req.user.userId;

    const goal = await this.goalService.getGoalById(goalId, userId);
    if (!goal) throw new NotFoundException('수정 권한이 없는 목표입니다.');
    return await this.goalService.updateGoal(goalId, updateGoalDto, userId);
  }

  // 삭제(소프트 딜리트)
  @ApiOperation({
    summary: '목표 삭제 (소프트 딜리트)',
    description: '목표 삭제',
  })
  @ApiResponse({
    status: 200,
    description: '목표 삭제 성공',
    type: String,
  })
  @Delete(':goalId')
  @UseGuards(AuthGuard('jwt'))
  async deleteGoal(
    @Param('goalId', ParseIntPipe) goalId: number,
    @Query('userId', ParseIntPipe) userId: number, // 이 부분은 인증을 강화하면 req.user.userId로 대체될 수 있습니다.
  ) {
    await this.goalService.deleteGoal(goalId, userId);
    return { message: '목표가 성공적으로 삭제되었습니다.' };
  }

  // 응원 증가
  @ApiOperation({
    summary: '응원 증가',
    description: '응원 증가',
  })
  @ApiResponse({
    status: 200,
    description: '응원 증가',
    type: CheerGoalDto,
  })
  @Post(':goalId/cheer')
  @UseGuards(AuthGuard('jwt'))
  async cheerGoal(@Param('goalid', ParseIntPipe) goalId: number) {
    return await this.goalService.cheerGoal(goalId);
  }

  // 응원 삭제
  @ApiOperation({
    summary: '응원 감소',
    description: '응원 감소',
  })
  @ApiResponse({
    status: 200,
    description: '응원 감소',
    type: CheerGoalDto,
  })
  @Delete(':goalId/cheer')
  @UseGuards(AuthGuard('jwt'))
  async canncelCheerGoal(@Param('goalid', ParseIntPipe) goalId: number) {
    return await this.goalService.cancelCheerGoal(goalId);
  }

  // 전체 누적 응원 수
  @ApiOperation({
    summary: '전체 누적 응원 수',
    description: '전체 누적 응원 수',
  })
  @ApiResponse({
    status: 200,
    description: '전체 누적 응원 수',
    type: CheerResponseDto,
  })
  @Get('cheer/total')
  @UseGuards(AuthGuard('jwt'))
  async getTotalCheerCount(@Req() req) {
    const userId = req.user.userId;
    const count = await this.goalService.totalCheerCount(userId);
    return { totalCheerCount: count };
  }

  // 오늘 누적 응원 수
  @ApiOperation({
    summary: '응원 감소',
    description: '응원 감소',
  })
  @ApiResponse({
    status: 200,
    description: '응원 감소',
    type: CheerResponseDto,
  })
  @Get('cheer/today')
  @UseGuards(AuthGuard('jwt'))
  async getTodayCheerCount(@Req() req) {
    const userId = req.user.userId;
    return this.goalService.todayCheerCount(userId);
  }
}
