import { Injectable } from '@nestjs/common';
import { PrismaService } from '../databases/prisma/prisma.service';
import { Bookmark } from '@prisma/client';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';

@Injectable()
export class BookmarksRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 북마크 생성
  async createBookmark(data: {
    userId: number;
    goalId: number;
    isBookmarked: boolean;
  }): Promise<BookmarkResponseDto> {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId: data.userId,
        goalId: data.goalId,
        isBookmarked: data.isBookmarked,
      },
    });
    return this.toDto(bookmark);
  }

  // ID로 단일 북마크를 조회
  async findById(bookmarkId: number): Promise<BookmarkResponseDto | null> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { bookmarkId },
      select: {
        bookmarkId: true,
        userId: true,
        goalId: true,
        isBookmarked: true,
      },
    });
    if (!bookmark) return null;
    return this.toDto(bookmark);
  }

  // 친구와 목표에 해당하는 북마크 조회
  async findByUserAndGoal(userId: number, goalId: number): Promise<BookmarkResponseDto | null> {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        goalId,
      },
      select: {
        bookmarkId: true,
        userId: true,
        goalId: true,
        isBookmarked: true,
      },
    });
    if (!bookmark) return null;
    return this.toDto(bookmark);
  }

  // 북마크 수정
  async updateBookmark(
    bookmarkId: number,
    data: Partial<{ isBookmarked: boolean }>,
  ): Promise<BookmarkResponseDto> {
    const bookmark = await this.prisma.bookmark.update({
      where: { bookmarkId },
      data,
      select: {
        bookmarkId: true,
        userId: true,
        goalId: true,
        isBookmarked: true,
      },
    });
    return this.toDto(bookmark);
  }

  // 북마크 삭제
  async deleteBookmark(bookmarkId: number): Promise<BookmarkResponseDto> {
    const bookmark = await this.prisma.bookmark.delete({
      where: { bookmarkId },
      select: {
        bookmarkId: true,
        userId: true,
        goalId: true,
        isBookmarked: true,
      },
    });
    return this.toDto(bookmark);
  }

  //  본인 북마크한 모든 목록 조회
  async findAllByUser(userId: number): Promise<BookmarkResponseDto[]> {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      select: {
        bookmarkId: true,
        userId: true,
        goalId: true,
        isBookmarked: true,
        goal: {
          select: {
            title: true,
            content: true,
            category: true,
            isCompleted: true,
          },
        },
      },
    });

    // DTO 변환 (관계 goal 필드 포함 DTO로 확장 가능)
    return bookmarks.map((bookmark) => ({
      bookmarkId: bookmark.bookmarkId,
      userId: bookmark.userId,
      goalId: bookmark.goalId,
      isBookmarked: bookmark.isBookmarked,
    }));
  }

  private toDto(bookmark: Bookmark): BookmarkResponseDto {
    return {
      bookmarkId: bookmark.bookmarkId,
      userId: bookmark.userId,
      goalId: bookmark.goalId,
      isBookmarked: bookmark.isBookmarked,
    };
  }
}
