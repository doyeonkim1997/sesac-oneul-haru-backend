import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateBookmarkDto } from './create-bookmark.dto';

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {
  @ApiProperty({ example: true, description: '북마크 여부', required: false })
  @IsBoolean()
  @IsOptional()
  isBookmarked?: boolean;
}
