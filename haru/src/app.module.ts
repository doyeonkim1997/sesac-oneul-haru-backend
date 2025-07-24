import { Module } from '@nestjs/common';
import { PrismaModule } from './databases/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { GoalModule } from './goal/goal.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [PrismaModule, UserModule, GoalModule, AuthModule],
})
export class AppModule {}
