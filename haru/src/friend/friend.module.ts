import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { FriendRepository } from './friend.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  controllers: [FriendController],
  providers: [FriendService, FriendRepository, UserRepository],
})
export class FriendModule {}
