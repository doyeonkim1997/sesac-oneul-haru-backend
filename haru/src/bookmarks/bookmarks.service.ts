import { Injectable } from '@nestjs/common';
import { BookmarksRepository } from './bookmarks.repository';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly bookmarkRepository: BookmarksRepository) {}

  // 북마크 생성
  async createBookmark(dto: CreateBookmarkDto): Promise<BookmarkResponseDto> {
    return this.bookmarkRepository.createBookmark(dto);
  }

  // ID로 단일 북마크를 조회
  async findById(bookmarkId: number): Promise<BookmarkResponseDto | null> {
    return this.bookmarkRepository.findById(bookmarkId);
  }

  // 본인 북마크한 모든 목록 조회
  async findAllByUser(userId: number): Promise<BookmarkResponseDto[]> {
    return this.bookmarkRepository.findAllByUser(userId);
  }

  // 북마크 수정
  async updateBookmark(bookmarkId: number, dto: UpdateBookmarkDto): Promise<BookmarkResponseDto> {
    return this.bookmarkRepository.updateBookmark(bookmarkId, dto);
  }

  // 북마크 삭제
  async deleteBookmark(bookmarkId: number): Promise<BookmarkResponseDto> {
    return this.bookmarkRepository.deleteBookmark(bookmarkId);
  }

  // 친구와 목표에 해당하는 북마크 조회
  async findByUserAndGoal(userId: number, goalId: number): Promise<BookmarkResponseDto | null> {
    return this.bookmarkRepository.findByUserAndGoal(userId, goalId);
  }
}
