import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';

// request 안의 user 가져오기 위한 데코레이터
export const getUser = createParamDecorator((data, ctx: ExecutionContext): UserEntity => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
