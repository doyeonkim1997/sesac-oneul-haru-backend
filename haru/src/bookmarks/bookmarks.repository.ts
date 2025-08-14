import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../databases/prisma/prisma.service';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';

@Injectable()
export class BookmarksRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 북마크 생성
  async createBookmark(goalId: number, userId: number): Promise<string> {
    try {
      await this.prisma.bookmark.create({
        data: {
          userId,
          goalId,
        },
      });
      return '북마크 생성';
    } catch {
      throw new InternalServerErrorException('북마크 생성에 실패했습니다.');
    }
  }

  // ID로 단일 북마크를 조회
  async findById(bookmarkId: number): Promise<BookmarkResponseDto | null> {
    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { bookmarkId },
        select: {
          bookmarkId: true,
          userId: true,
          goalId: true,
          goal: {
            select: {
              content: true,
              category: true,
              isCompleted: true,
            },
          },
        },
      });
      return bookmark;
    } catch {
      throw new InternalServerErrorException('북마크 조회에 실패했습니다.');
    }
  }

  // 사용자와 목표에 해당하는 북마크 조회
  async findByUserAndGoal(userId: number, goalId: number): Promise<BookmarkResponseDto | null> {
    try {
      const bookmark = await this.prisma.bookmark.findFirst({
        where: {
          userId,
          goalId,
        },
        select: {
          bookmarkId: true,
          userId: true,
          goalId: true,
          goal: {
            select: {
              content: true,
              category: true,
              isCompleted: true,
            },
          },
        },
      });

      return bookmark;
    } catch {
      throw new InternalServerErrorException('북마크 조회에 실패했습니다.');
    }
  }

  // 북마크 삭제
  async deleteBookmark(bookmarkId: number): Promise<string> {
    try {
      await this.prisma.bookmark.delete({
        where: { bookmarkId },
        select: {
          bookmarkId: true,
          userId: true,
          goalId: true,
        },
      });
      return '북마크 삭제';
    } catch {
      throw new NotFoundException('삭제할 북마크를 찾을 수 없습니다.');
    }
  }

  // 본인 북마크한 모든 목록 조회
  async findAllByUser(userId: number): Promise<BookmarkResponseDto[]> {
    try {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { userId },
        select: {
          bookmarkId: true,
          userId: true,
          goalId: true,
          goal: {
            select: {
              content: true,
              category: true,
              isCompleted: true,
            },
          },
        },
      });

      return bookmarks;
    } catch {
      throw new InternalServerErrorException('북마크 목록 조회에 실패했습니다.');
    }
  }
}
