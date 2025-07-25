import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Injectable()
export class BookmarksRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // 북마크 추가
  async addBookmark(userId: number, goalId: number) {
    return this.prismaService.bookmark.create({
      data: {
        userId,
        goalId,
        isBookmarked: true,
      },
    });
  }

  // 북마크 삭제
  async deleteBookmark(userId: number, goalId: number) {
    return this.prismaService.bookmark.deleteMany({
      where: {
        userId,
        goalId,
      },
    });
  }

  // 모든 사용자 북마크 조회
  async findAllByUser(userId: number) {
    return this.prismaService.bookmark.findMany({
      where: { userId },
      include: {
        goal: true,
      },
    });
  }

  // 특정 목표의 북마크 조회
  async getBookmarkByGoalId(userId: number, goalId: number) {
    return this.prismaService.bookmark.findFirst({
      where: {
        userId,
        goalId,
      },
    });
  }

  // 북마크 존재 여부 확인
  async exists(userId: number, goalId: number): Promise<boolean> {
    const bookmark = await this.prismaService.bookmark.findFirst({
      where: {
        userId,
        goalId,
      },
    });
    return !!bookmark;
  }
}
