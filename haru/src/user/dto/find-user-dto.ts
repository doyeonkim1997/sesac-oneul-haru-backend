import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class FindUserDto extends PickType(UserEntity, [
  'userId',
  'nickName',
  'tier',
  'createdAt',
  'updatedAt',
] as const) {}
