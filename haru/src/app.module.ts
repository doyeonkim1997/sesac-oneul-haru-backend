import { Module } from '@nestjs/common';
import { PrismaModule } from './databases/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { GoalModule } from './goal/goal.module';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
@Module({
  imports: [PrismaModule, UserModule, GoalModule, AuthModule, BookmarksModule],
})
export class AppModule {}
