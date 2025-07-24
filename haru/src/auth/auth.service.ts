import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import {
  IAuthServiceSocialLoginInput,
  IAuthServiceSocialLoginOutput,
} from './interfaces/iauth-service-social-login';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin({
    socialLoginDto,
  }: IAuthServiceSocialLoginInput): Promise<IAuthServiceSocialLoginOutput> {
    const { email } = socialLoginDto;
    let user = await this.authRepository.findByEmail({ email });

    if (!user) {
      user = await this.authRepository.createUser({
        createUserDto: socialLoginDto,
      });
    }

    const accessToken = this.getAccessToken({ userId: user.userId });
    const refreshToken = this.getRefreshToken({ userId: user.userId });

    // accessToken과 refreshToken 반환
    return { accessToken, refreshToken };
  }

  // accessToken 생성 1시간
  private getAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });
  }

  // refreshToken 생성 7일
  private getRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }
}
