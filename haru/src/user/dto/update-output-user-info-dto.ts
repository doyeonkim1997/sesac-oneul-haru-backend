import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class UpdateOutputUserInfoDto extends PickType(UserEntity, [
  'userId',
  'nickName',
  'password',
  'imageId',
]) {}
