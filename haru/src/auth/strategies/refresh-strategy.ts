import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private logger = new Logger('RefreshStrategy');

  constructor(private readonly authService: AuthService) {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET이 .env 파일에 없음');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    this.logger.debug('RefreshStrategy validate 시작');

    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      this.logger.error('요청 쿠키에 refreshToken이 없습니다.');
      throw new UnauthorizedException('Refresh Token이 존재하지 않습니다.');
    }

    const user = await this.authService.getUserIfRefreshTokenMatchs(refreshToken, payload.userId);

    if (!user) {
      this.logger.warn('Refresh Token이 유효하지 않거나 사용자와 매칭되지 않습니다.');
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }

    this.logger.debug('RefreshStrategy 검증 성공');

    return user;
  }
}
