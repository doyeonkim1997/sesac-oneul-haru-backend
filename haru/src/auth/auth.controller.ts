import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao-auth-guard';
import { SocialUser, SocialUserAfterAuth } from './user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async kakaoLogin(
    @SocialUser() socialUser: SocialUserAfterAuth,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken, refreshToken } = await this.authService.kakaoLogin({
      socialLoginDto: socialUser,
    });

    // refreshToken과 accessToekn을 쿠키에 넣고 전달 후
    res.cookie('refreshToken', refreshToken);
    res.cookie('accessToken', accessToken);

    // 홈페이지로 이동(url 정해지지 않음)
    res.redirect('/');
  }
}
