import { UnauthorizedException } from '@nestjs/common';

// 로그인 검사용 메서드
export function validateLogin(loggedInUserId: number, targetUserId: number): void {
  if (loggedInUserId !== targetUserId) {
    throw new UnauthorizedException('해당 사용자가 로그인한 사용자가 아닙니다.');
  }
}
