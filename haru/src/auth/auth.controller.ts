import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth-guard';
import { SocialUser, SocialUserAfterAuth } from './user.decorator';
import { GoogleAuthGuard } from './guards/google-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '카카오 로그인/회원가입',
    description: '카카오 로그인 버튼을 누르면 회원가입',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async kakaoLogin(
    @SocialUser() socialUser: SocialUserAfterAuth,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken } = await this.authService.kakaoLogin({
      socialLoginDto: socialUser,
    });

    // refreshToken과 accessToekn을 쿠키에 넣고 전달 후
    // res.cookie('refreshToken', refreshToken);
    res.cookie('accessToken', accessToken);

    // 홈페이지로 이동(url 정해지지 않음)
    res.redirect('/');
  }

  @ApiOperation({
    summary: '구글 로그인/회원가입',
    description: '구글 로그인 버튼을 누르면 로그인 창으로 이동',
  })
  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async googleLogin(): Promise<void> {}

  @ApiOperation({
    summary: '구글 로그인 콜백',
    description: '구글 로그인 콜백 주소, 토큰 생성 및 로그인/회원가입 실행',
  })
  // 구글 로그인 콜백 url
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @SocialUser() socialUser: SocialUserAfterAuth,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.googleLogin({
      socialLoginDto: socialUser,
    });

    res.cookie('accessToken', accessToken);

    res.redirect('/');
  }
}
