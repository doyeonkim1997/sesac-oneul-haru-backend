import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import {
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FindBookmarkDto } from './dto/find-bookmark.dto';
import { FindBookmarksDto } from './dto/find-bookmarks.dto';

@ApiTags('bookmarkss')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  // 북마크 생성
  @ApiOperation({
    summary: '북마크 생성',
    description: '북마크를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '북마크 생성 성공',
    type: CreateBookmarkDto,
  })
  @ApiBadRequestResponse({
    description: ' 북마크 생성에 실패했습니다.',
  })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createBookmark(@Body() createBookmarkDto: CreateBookmarkDto): Promise<CreateBookmarkDto> {
    return this.bookmarkService.createBookmark(createBookmarkDto);
  }

  // 북마크 조회
  @ApiOperation({
    summary: '북마크 조회',
    description: '북마크를 조회.',
  })
  @ApiResponse({
    status: 200,
    description: '북마크 조회',
    type: FindBookmarkDto,
  })
  @ApiBadRequestResponse({
    description: ' 북마크 조회에 실패했습니다.',
  })
  @Get(':bookmarkId')
  @UseGuards(AuthGuard('jwt'))
  async findById(
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ): Promise<FindBookmarkDto | null> {
    return await this.bookmarkService.findById(bookmarkId);
  }

  // 북마크 수정
  @ApiOperation({
    summary: '북마크 수정',
    description: '북마크를 수정.',
  })
  @ApiResponse({
    status: 200,
    description: '북마크 수정',
    type: String,
  })
  @ApiNotFoundResponse({
    description: '수정할 북마크를 찾을 수 없습니다.',
  })
  @Patch(':bookmarkId')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ): Promise<string> {
    await this.bookmarkService.updateBookmark(bookmarkId, updateBookmarkDto);
    return '북마크 수정 완료';
  }

  // 북마크 삭제
  @ApiOperation({
    summary: '북마크 삭제',
    description: '북마크를 삭제.',
  })
  @ApiResponse({
    status: 200,
    description: '북마크 삭제',
    type: String,
  })
  @ApiNotFoundResponse({
    description: '삭제할 북마크를 찾을 수 없습니다.',
  })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteBookmark(@Param('id', ParseIntPipe) id: number): Promise<string> {
    await this.bookmarkService.deleteBookmark(id);
    return '북마크 삭제 완료';
  }

  // 사용자 북마크 모든 조회
  @ApiOperation({
    summary: '사용자 모든 북마크 조회',
    description: '사용자 모든 북마크 조회.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 모든 북마크 조회',
    type: FindBookmarksDto,
  })
  @ApiBadRequestResponse({
    description: '북마크 조회에 실패했습니다.',
  })
  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async findAllByUser(@Param('userId', ParseIntPipe) userId: number): Promise<FindBookmarksDto> {
    const bookmarks = await this.bookmarkService.findAllByUser(userId);
    return { bookmarks };
  }
}
