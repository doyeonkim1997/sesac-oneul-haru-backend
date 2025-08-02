import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';
import { getUser } from 'src/user/get-user-decorator';
import { CheerResponseDto } from './dto/cheer-response.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { FindGoalDto } from './dto/find-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalService } from './goal.service';
import { GoalsCalenderDto } from './dto/goals-calender.dto';

@ApiTags('Goal')
@Controller('goals')
export class GoalController {
  private logger = new Logger('GoalController');
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
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않는 사용자입니다',
  })
  @ApiInternalServerErrorResponse({
    description: '목표 생성에 실패했습니다.',
  })
  @ApiBadRequestResponse({
    description: '오늘 작성한 목표가 이미 존재합니다.',
  })
  @ApiBearerAuth()
  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createGoalDto: CreateGoalDto, @getUser() user: UserEntity) {
    return await this.goalService.createGoal(createGoalDto, user.userId);
  }

  @ApiOperation({
    summary: '년, 월로 해당하는 목표 조회 ',
    description: 'year, month로 해당하는 목표와 완료 여부 조회',
  })
  @ApiResponse({
    status: 201,
    description: '목표 목록',
    type: GoalsCalenderDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('calender')
  async getGoalsCalender(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @getUser() user: UserEntity,
  ): Promise<GoalsCalenderDto[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999); // 말일

    return this.goalService.findGoalsCalender(user.userId, start, end);
  }

  @ApiOperation({
    summary: '년, 월로 해당하는 친구 목표 조회 ',
    description: 'year, month로 해당하는 친구의 목표와 완료 여부 조회',
  })
  @ApiResponse({
    status: 201,
    description: '목표 목록',
    type: GoalsCalenderDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiBadRequestResponse({
    description: '친구가 아닌 사용자를 조회했습니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('calender/:friendId')
  async getFriendGoalsCalender(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Param('friendId', ParseIntPipe) friendId: number,
    @getUser() user: UserEntity,
  ): Promise<GoalsCalenderDto[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999); // 말일

    return this.goalService.findFriendGoalsCalender(user.userId, friendId, start, end);
  }

  // 사용자 전체 목표 조회
  @ApiOperation({
    summary: '사용자의 전체 목표 조회',
    description: '사용자가 작성한 모든 목표 조회',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목표 목록 조회 성공',
    type: FindGoalDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '목표 목록 조회에 실패했습니다.',
  })
  @ApiBearerAuth()
  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@getUser() user: UserEntity): Promise<FindGoalDto[]> {
    return await this.goalService.getAllGoals(user);
  }

  // 사용자 목표 수정
  @ApiOperation({
    summary: '목표 수정',
    description: '목표 수정, content, category',
  })
  @ApiResponse({
    status: 200,
    description: '목표 수정 성공',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않는 사용자입니다',
  })
  @ApiNotFoundResponse({
    description: '해당 목표를 찾을 수 없습니다.',
  })
  @ApiNotFoundResponse({
    description: '수정 권한이 없는 목표이거나 목표를 찾을 수 없습니다.',
  })
  @ApiBearerAuth()
  @Patch(':goalId')
  @UseGuards(AuthGuard('jwt'))
  async updateGoal(
    @Param('goalId', ParseIntPipe) goalId: number,
    @Body() updateGoalDto: UpdateGoalDto,
    @getUser() user: UserEntity,
  ) {
    this.logger.debug('사용자 수정 컨트롤러 시작 ');
    const goal = await this.goalService.getGoalById(goalId, user.userId);
    if (!goal) throw new NotFoundException('수정 권한이 없는 목표입니다.');
    await this.goalService.updateGoal(goalId, updateGoalDto, user.userId);
    this.logger.debug(`${goal.content} 변경되는 목표 확인 `);
    return '목표 수정 완료';
  }

  //완료 상태 토글
  @ApiOperation({
    summary: '완료 상태 토글',
    description: 'isCompleted를 true면 false로 false면 true로 변경',
  })
  @ApiResponse({
    status: 200,
    description: '완료 상태 변경 여부',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않는 사용자입니다',
  })
  @ApiNotFoundResponse({
    description: '목표를 찾을 수 없습니다.',
  })
  @ApiBearerAuth()
  @Patch('/:goalId/toggle')
  @UseGuards(AuthGuard('jwt'))
  toggleIsCompleted(@Param('goalId', ParseIntPipe) goalId: number) {
    this.logger.debug(`완료 상태 토글 시작`);
    return this.goalService.toggleIsCompleted(goalId);
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
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiNotFoundResponse({
    description: '삭제할 목표가 존재하지 않습니다.',
  })
  @ApiBearerAuth()
  @Delete(':goalId')
  @UseGuards(AuthGuard('jwt'))
  async deleteGoal(@Param('goalId', ParseIntPipe) goalId: number, @getUser() user: UserEntity) {
    await this.goalService.deleteGoal(goalId, user.userId);
    return '목표 삭제 완료.';
  }

  // 응원 증가
  @ApiOperation({
    summary: '응원 증가',
    description: '응원 증가',
  })
  @ApiResponse({
    status: 200,
    description: '응원 증가',
    type: CheerResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않는 사용자입니다',
  })
  @ApiInternalServerErrorResponse({
    description: '목표 삭제에 실패했습니다.',
  })
  @ApiNotFoundResponse({
    description: '응원할 목표가 존재하지 않습니다.',
  })
  @ApiBadRequestResponse({
    description: '자신의 목표는 응원할 수 없습니다.',
  })
  @ApiBearerAuth()
  @Get(':goalId/cheer')
  @UseGuards(AuthGuard('jwt'))
  async cheerGoal(@Param('goalId', ParseIntPipe) goalId: number, @getUser() user: UserEntity) {
    return await this.goalService.cheerGoal(goalId, user.userId);
  }

  // 응원 삭제
  @ApiOperation({
    summary: '응원 감소',
    description: '응원 감소',
  })
  @ApiResponse({
    status: 200,
    description: '응원 감소',
    type: CheerResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않는 사용자입니다',
  })
  @ApiNotFoundResponse({
    description: '응원할 목표가 존재하지 않습니다.',
  })
  @ApiBadRequestResponse({
    description: '자신의 목표는 응원할 수 없습니다.',
  })
  @ApiBearerAuth()
  @Delete(':goalId/cheer')
  @UseGuards(AuthGuard('jwt'))
  async cancelCheerGoal(
    @Param('goalId', ParseIntPipe) goalId: number,
    @getUser() user: UserEntity,
  ) {
    return await this.goalService.cancelCheerGoal(goalId, user.userId);
  }

  // 전체 누적 응원 수
  @ApiOperation({
    summary: '전체 누적 응원 수',
    description: '전체 누적 응원 수',
  })
  @ApiResponse({
    status: 200,
    description: '전체 누적 응원 수',
    schema: {
      type: 'object',
      properties: {
        totalCheerCount: {
          type: 'number',
          example: 7,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않는 사용자입니다',
  })
  @ApiInternalServerErrorResponse({
    description: '전체 응원 누적 수 조회에 실패했습니다.',
  })
  @ApiBearerAuth()
  @Get('cheer/total')
  @UseGuards(AuthGuard('jwt'))
  async getTotalCheerCount(@getUser() user: UserEntity) {
    const count = await this.goalService.totalCheerCount(user.userId);
    return { totalCheerCount: count };
  }

  // 오늘 누적 응원 수
  @ApiOperation({
    summary: '오늘 누적 응원 수',
    description: '오늘 누적된 전체 응원 개수',
  })
  @ApiResponse({
    status: 200,
    description: '오늘 누적된 전체 응원 개수',
    schema: {
      type: 'object',
      properties: {
        totalCheerCount: {
          type: 'number',
          example: 7,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않는 사용자입니다',
  })
  @ApiInternalServerErrorResponse({
    description: '오늘 응원 누적 수 조회에 실패했습니다.',
  })
  @ApiBearerAuth()
  @Get('cheer/today')
  @UseGuards(AuthGuard('jwt'))
  async getTodayCheerCount(@getUser() user: UserEntity) {
    const count = this.goalService.todayCheerCount(user.userId);
    return { todayCheerCount: count };
  }
}
