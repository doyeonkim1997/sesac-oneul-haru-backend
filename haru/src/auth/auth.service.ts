import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import {
  IAuthServiceSocialLoginInput,
  IAuthServiceSocialLoginOutput,
} from './interfaces/iauth-service-social-login';
import { JwtService } from '@nestjs/jwt';
import { AuthType } from './enum/auth-type';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  // 카카오 로그인
  async kakaoLogin({
    socialLoginDto,
  }: IAuthServiceSocialLoginInput): Promise<IAuthServiceSocialLoginOutput> {
    const { email, password, nickName } = socialLoginDto;
    // 유저를 찾아봄
    let user = await this.authRepository.findByEmail({ email });

    // 가입된 유저가 아니면 회원가입
    if (!user) {
      // 비밀번호 해싱해서 저장
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await this.authRepository.createUser({
        createUserDto: { email, hashedPassword, nickName },
        authType: AuthType.KAKAO, // kakao로 회원가입
      });
    }

    // accessToken 생성
    const accessToken = this.createAccessToken({ userId: user.userId });
    // const refreshToken = this.getRefreshToken({ userId: user.userId });

    // accessToken 반환
    return { accessToken };
  }

  // 구글 로그인
  async googleLogin({
    socialLoginDto,
  }: IAuthServiceSocialLoginInput): Promise<IAuthServiceSocialLoginOutput> {
    const { email, password, nickName } = socialLoginDto;
    let user = await this.authRepository.findByEmail({ email });

    // 가입된 유저가 아니면 회원가입
    if (!user) {
      // 비밀번호 해싱해서 저장
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await this.authRepository.createUser({
        createUserDto: { email, hashedPassword, nickName },
        authType: AuthType.GOOGLE, // google로 회원가입
      });
    }

    const accessToken = this.createAccessToken({ userId: user.userId });

    return { accessToken };
  }

  // accessToken 생성 1시간
  private createAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });
  }

  // refreshToken 생성 7일
  private createRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }
}
