import { Module } from '@nestjs/common';
import { PrismaModule } from './databases/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { GoalModule } from './goal/goal.module';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    GoalModule,
    AuthModule,
    BookmarksModule,
    MailModule,
  ],
})
export class AppModule {}
