import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
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
import { BookmarksService } from './bookmarks.service';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  // 북마크 조회 (사용 X)
  // @ApiOperation({
  //   summary: '북마크 조회',
  //   description: '북마크를 조회. (사용 X)',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '북마크 조회',
  //   type: FindBookmarkDto,
  // })
  // @ApiInternalServerErrorResponse({
  //   description: ' 북마크 조회에 실패했습니다.',
  // })
  // @Get('/:bookmarkId')
  // @UseGuards(AuthGuard('jwt'))
  // async findById(
  //   @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  // ): Promise<FindBookmarkDto | null> {
  //   return await this.bookmarkService.findById(bookmarkId);
  // }

  // 북마크 토글
  @ApiOperation({
    summary: '북마크 토글',
    description: '북마크 토글을 눌러 북마크 상태 업데이트.',
  })
  @ApiResponse({
    status: 201,
    description: '북마크 토글 상태 (북마크 생성 완료 / 북마크 삭제 완료)',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiNotFoundResponse({
    description: '삭제할 북마크를 찾을 수 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '북마크 생성에 실패했습니다.',
  })
  @ApiBearerAuth()
  @Get('/:goalId')
  @UseGuards(AuthGuard('jwt'))
  async toggleBookmark(
    @Param('goalId', ParseIntPipe) goalId: number,
    @getUser() user: UserEntity,
  ): Promise<string> {
    return this.bookmarkService.toggleBookmark(goalId, user.userId);
  }

  // 사용자 북마크 모든 조회
  @ApiOperation({
    summary: '사용자의 모든 북마크 조회',
    description: '사용자의 모든 북마크 조회.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 모든 북마크 조회',
    type: BookmarkResponseDto,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: '북마크 목록 조회에 실패했습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 필요합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '해당 사용자가 로그인한 사용자가 아닙니다.',
  })
  @ApiBearerAuth()
  @Get(':userId/all')
  @UseGuards(AuthGuard('jwt'))
  async findAllByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @getUser() user: UserEntity,
  ): Promise<BookmarkResponseDto[]> {
    const bookmarks = await this.bookmarkService.findAllByUser(userId, user);
    return bookmarks;
  }
}
