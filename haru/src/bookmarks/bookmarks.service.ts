import { Injectable } from '@nestjs/common';
import { validateLogin } from 'src/auth/validator/validateLogin';
import { UserEntity } from 'src/user/entity/user.entity';
import { BookmarksRepository } from './bookmarks.repository';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly bookmarkRepository: BookmarksRepository) {}

  // 북마크 생성
  async createBookmark(dto: CreateBookmarkDto, userId: number): Promise<string> {
    return this.bookmarkRepository.createBookmark(dto.goalId, userId);
  }

  // ID로 단일 북마크를 조회
  async findById(bookmarkId: number): Promise<BookmarkResponseDto | null> {
    return this.bookmarkRepository.findById(bookmarkId);
  }

  // 본인 북마크한 모든 목록 조회
  async findAllByUser(userId: number, user: UserEntity): Promise<BookmarkResponseDto[]> {
    validateLogin(userId, user.userId);
    return this.bookmarkRepository.findAllByUser(userId);
  }

  // 북마크 수정
  // async updateBookmark(
  //   bookmarkId: number,
  //   userId: number,
  //   dto: UpdateBookmarkDto,
  // ): Promise<BookmarkResponseDto> {
  //   const bookmark = await this.bookmarkRepository.findById(bookmarkId);

  //   if (!bookmark) {
  //     throw new NotFoundException('수정할 북마크를 찾을 수 없습니다.');
  //   }

  //   // 북마크가 자신이 한 것인지 확인
  //   validateLogin(bookmark.userId, userId);

  //   return this.bookmarkRepository.updateBookmark(bookmarkId, dto);
  // }

  // 북마크 삭제
  // async deleteBookmark(bookmarkId: number, userId: number): Promise<string> {
  //   const bookmark = await this.bookmarkRepository.findById(bookmarkId);

  //   if (!bookmark) {
  //     throw new NotFoundException('삭제할 북마크를 찾을 수 없습니다.');
  //   }

  //   validateLogin(userId, bookmark.userId);

  //   return this.bookmarkRepository.deleteBookmark(bookmarkId);
  // }

  // 친구와 목표에 해당하는 북마크 조회
  async findByUserAndGoal(userId: number, goalId: number): Promise<BookmarkResponseDto | null> {
    return this.bookmarkRepository.findByUserAndGoal(userId, goalId);
  }

  // 북마크 토글(생성, 삭제)
  async toggleBookmark(goalId: number, userId: number): Promise<string> {
    const bookmark = await this.bookmarkRepository.findByUserAndGoal(userId, goalId);

    // 북마크가 존재하면 삭제
    if (bookmark) {
      return await this.bookmarkRepository.deleteBookmark(bookmark.bookmarkId);
    } else {
      // 북마크가 없으면 생성
      return await this.bookmarkRepository.createBookmark(goalId, userId);
    }
  }
}
