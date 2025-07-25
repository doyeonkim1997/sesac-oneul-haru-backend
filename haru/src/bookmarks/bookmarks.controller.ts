import { Controller, Get, Post, Delete } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  // 유저의 북마크 조회
  @Get('check')
  async getBookmarksByUserId(userId: number) {
    return this.bookmarksService.getBookmarksByUserId(userId);
  }

  // 북마크 추가
  @Post()
  async addBookmark(userId: number, goalId: number) {
    return this.bookmarksService.addBookmark(userId, goalId);
  }

  // 북마크 삭제
  @Delete()
  async deleteBookmark(userId: number, goalId: number) {
    return this.bookmarksService.deleteBookmark(userId, goalId);
  }

  // 북마크 존재 여부 확인
  async checkBookmark(userId: number, goalId: number) {
    return this.bookmarksService.checkBookmark(userId, goalId);
  }
}
