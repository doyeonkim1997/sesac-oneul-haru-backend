import { Injectable } from '@nestjs/common';
import { BookmarksRepository } from './bookmarks.repository';

@Injectable()
export class BookmarksService {
  constructor(private readonly bookmarksRepository: BookmarksRepository) {}

  // 북마크 추가
  async addBookmark(userId: number, goalId: number) {
    return this.bookmarksRepository.addBookmark(userId, goalId);
  }

  // 북마크 삭제
  async deleteBookmark(userId: number, goalId: number) {
    const deleteBook = await this.bookmarksRepository.deleteBookmark(userId, goalId);
    if (deleteBook.count === 0) {
      throw new Error('북마크가 존재하지 않습니다.');
    }
    return { message: 'Bookmark removed' };
  }

  // 유저의 북마크 조회
  async getBookmarksByUserId(userId: number) {
    return this.bookmarksRepository.findAllByUser(userId);
  }

  // 북마크 존재 여부 확인
  async checkBookmark(userId: number, goalId: number) {
    const exists = await this.bookmarksRepository.exists(userId, goalId);
    if (!exists) {
      return { isBookmarked: false, message: '북마크가 존재하지 않습니다.' };
    }
    return { isBookmarked: exists };
  }
}
