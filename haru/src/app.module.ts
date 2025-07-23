import { Module } from '@nestjs/common';
import { PrismaModule } from './databases/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
