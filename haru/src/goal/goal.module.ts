import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalRepository } from './goalRepository';
import { GoalController } from './goal.controller';
import { PrismaService } from 'src/databases/prisma/prisma.service';
@Module({
  imports: [PrismaService],
  controllers: [GoalController],
  providers: [GoalService, GoalRepository],
  exports: [GoalService], // Exporting GoalService for use in other modules
})
export class GoalModule {}
