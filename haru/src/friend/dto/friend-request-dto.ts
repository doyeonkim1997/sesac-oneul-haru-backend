import { PickType } from '@nestjs/swagger';
import { FriendRequestEntity } from '../entity/friend-request.entity';

export class FriendRequestDto extends PickType(FriendRequestEntity, [
  'requestId',
  'userId',
  'receiverId',
  'status',
  'createdAt',
]) {}
