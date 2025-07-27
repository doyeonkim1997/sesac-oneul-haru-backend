import { ApiProperty } from '@nestjs/swagger';
import { FindBookmarkDto } from './find-bookmark.dto';

export class FindBookmarksDto {
  @ApiProperty({ type: [FindBookmarkDto], description: '북마크 리스트' })
  bookmarks: FindBookmarkDto[];
}
