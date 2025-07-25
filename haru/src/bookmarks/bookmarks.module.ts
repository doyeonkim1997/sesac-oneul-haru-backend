import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { BookmarksRepository } from './bookmarks.repository';
import { PrismaModule } from '../databases/prisma/prisma.module'; // Assuming you have a PrismaModule for database access

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService, BookmarksRepository],
  imports: [PrismaModule], // Assuming PrismaModule is imported for database access
})
export class BookmarksModule {}
