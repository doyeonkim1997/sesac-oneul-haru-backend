import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { BookmarksRepository } from './bookmarks.repository';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService, BookmarksRepository],
  imports: [PrismaService], // Assuming PrismaModule is imported for database access
})
export class BookmarksModule {}
