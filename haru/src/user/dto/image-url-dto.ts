import { ApiProperty } from '@nestjs/swagger';

export class ImageUrlDto {
  @ApiProperty({ example: 'https://example.com/image.png' })
  imageUrl: string;
}
