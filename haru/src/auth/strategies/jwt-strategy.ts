import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from '../auth.repository';
import { FindUserInfoDto } from '../dto/find-user-info-dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepository: AuthRepository) {
    // jwt 환경변수 체크
    const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET이 .env 파일에 없음');
    }

    super({
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { email } = payload;

    const user: FindUserInfoDto | null = await this.authRepository.findByEmail({ email });

    if (!user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    return user;
  }
}
