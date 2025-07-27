import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BookmarkService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(@Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarkService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarkService.deleteBookmark(id);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.bookmarkService.findAllByUser(userId);
  }
}
