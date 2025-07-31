import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: '목표 미완료자 알림',
    description: '목표 미완료자 알림',
  })
  @ApiResponse({
    status: 200,
    description: '목표 미완료자 알림',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않는 사용자입니다',
  })
  @ApiInternalServerErrorResponse({
    description: '미완료된 목표가 없습니다.',
  })
  @Get('sse')
  @UseGuards(AuthGuard('jwt'))
  async connect(@Req() req: Request, @Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');

    this.notificationService.addClient(res);

    req.on('close', () => {
      this.notificationService.removeClient(res);
    });
  }
}
