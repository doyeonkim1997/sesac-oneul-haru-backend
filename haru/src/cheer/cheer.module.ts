import { Module } from '@nestjs/common';
import { CheerController } from './cheer.controller';
import { CheerService } from './cheer.service';
import { CheerRepository } from './cheer.repository';

@Module({
  controllers: [CheerController],
  providers: [CheerService, CheerRepository],
})
export class CheerModule {}
