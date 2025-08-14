import { Controller, Get, Logger, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';
import { getUser } from 'src/user/get-user-decorator';
import { CheerService } from './cheer.service';

@Controller('cheer')
export class CheerController {
  private logger = new Logger('CheerController');
  constructor(private readonly cheerService: CheerService) {}

  // 응원 증가
  @ApiOperation({
    summary: '응원 토글',
    description: '응원 토글하여 응원 및 취소',
  })
  @ApiResponse({
    status: 200,
    description: '응원 추가 / 응원 삭제',
    type: String,
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
  @Patch('/:goalId')
  @UseGuards(AuthGuard('jwt'))
  async toggleCheer(
    @Param('goalId', ParseIntPipe) goalId: number,
    @getUser() user: UserEntity,
  ): Promise<string> {
    return await this.cheerService.toggleCheer(goalId, user.userId);
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
  @Get('/total')
  @UseGuards(AuthGuard('jwt'))
  async getTotalCheerCount(@getUser() user: UserEntity): Promise<{ totalCheerCount: number }> {
    const count = await this.cheerService.totalCheerCount(user.userId);
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
        todayCheerCount: {
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
  @ApiBearerAuth()
  @Get('/today')
  @UseGuards(AuthGuard('jwt'))
  async getTodayCheerCount(@getUser() user: UserEntity): Promise<{ todayCheerCount: number }> {
    const count = await this.cheerService.todayCheerCount(user.userId);
    return { todayCheerCount: count };
  }

  @ApiOperation({
    summary: '로그인한 사용자가 응원한 목표의 id 리스트 조회',
    description: '로그인한 사용자가 응원한 goalId 리스트 조회',
  })
  @ApiResponse({
    status: 200,
    description: '사용자가 응원한 모든 목표 id들',
    type: Number,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiBearerAuth()
  // 내가 응원한 goalId 리스트 조회
  @Get('my-cheers')
  @UseGuards(AuthGuard('jwt'))
  async getMyCheers(@getUser() user: UserEntity): Promise<number[]> {
    return await this.cheerService.getMyCheeredGoalIds(user.userId);
  }
}
