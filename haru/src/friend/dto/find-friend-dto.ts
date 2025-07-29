import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entity/user.entity';

export class FindFriendDto extends OmitType(UserEntity, [
  'createdAt',
  'updatedAt',
  'password',
  'authType',
  'refreshToken',
  'imageId',
  'isDeleted',
] as const) {}
