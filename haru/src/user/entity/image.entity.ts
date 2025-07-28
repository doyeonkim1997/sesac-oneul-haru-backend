import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ImageEntity {
  @ApiProperty({
    type: Number,
    description: '이미지 테이블의 이미지id',
    example: '2',
    required: true,
  })
  @IsInt()
  imageId: number;

  @ApiProperty({
    type: String,
    description: '이미지 URL',
    example: 'aklsdjqlwiruasklcnalkfhkals',
    required: false,
  })
  @IsInt()
  imageUrl: string | null;
}
