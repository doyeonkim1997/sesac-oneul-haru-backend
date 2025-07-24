import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class FindFriendDto extends OmitType(UserEntity, [
  'createdAt',
  'updatedAt',
  'email',
  'password',
  'authType',
] as const) {}
