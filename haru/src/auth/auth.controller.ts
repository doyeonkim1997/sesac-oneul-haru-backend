import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserEntity } from 'src/user/entity/user.entity';
import { getUser } from 'src/user/get-user-decorator';
import { AuthService } from './auth.service';
import { EmailCheckDto } from './dto/email-check-dto';
import { EmailLoginDto } from './dto/email-login-dto';
import { EmailSignUpDto } from './dto/email-signup-dto';
import { AuthType } from './enum/auth-type';
import { GoogleAuthGuard } from './guards/google-auth-guard';
import { JwtRefreshGuard } from './guards/jwt-refresh-guard';
import { KakaoAuthGuard } from './guards/kakao-auth-guard';
import { NaverAuthGuard } from './guards/naver-auth-guard';
import { SocialUser, SocialUserAfterAuth } from './user.decorator';
import { ImageUrlDto } from 'src/user/dto/image-url-dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private readonly authService: AuthService) {}

  // 카카오 로그인 창 이동
  @ApiOperation({
    summary: '카카오 로그인/회원가입',
    description: '카카오 로그인 버튼을 누르면 로그인 창으로 이동',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async kakaoLogin(): Promise<void> {}

  // 카카오 로그인 콜백
  @ApiOperation({
    summary: '카카오 로그인/회원가입',
    description: '카카오 로그인 버튼을 누르면 회원가입',
  })
  @ApiResponse({
    description: 'JWT accessToken 반환',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyjHskdjqk2kjakdjiqkljLKKKKKDjjdswioque',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '이미 가입된 상태입니다.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('/kakao/callback')
  async kakaoCallback(
    @SocialUser() socialUser: SocialUserAfterAuth,
    @Res() res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.kakaoLogin({
      socialLoginDto: socialUser,
    });

    // refreshToken과 accessToken을 쿠키에 넣고 전달 후
    res.cookie('refreshToken', refreshToken, { httpOnly: true }); // xss 공격 보호
    // res.cookie('accessToken', accessToken, { httpOnly: true });

    console.log(`accessToken 확인 : ${accessToken}`);
    console.log(`refreshToken 확인 : ${refreshToken}`);
    res.send('<script>window.close()</script>');
  }

  // 구글 로그인 창 이동
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
  @ApiResponse({
    description: 'JWT accessToken 반환',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyjHskdjqk2kjakdjiqkljLKKKKKDjjdswioque',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '이미 가입된 상태입니다.',
  })
  // 구글 로그인 콜백 url
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @SocialUser() socialUser: SocialUserAfterAuth,
    @Res() res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.googleLogin({
      socialLoginDto: socialUser,
    });

    // res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    console.log(`accessToken 확인 : ${accessToken}`);
    console.log(`refreshToken 확인 : ${refreshToken}`);
    res.send('<script>window.close()</script>');
  }

  // 네이버 로그인 창 이동
  @ApiOperation({
    summary: '네이버 로그인/회원가입',
    description: '네이버 로그인 버튼을 누르면 로그인 창으로 이동',
  })
  @UseGuards(NaverAuthGuard)
  @Get('login/naver')
  async naverLogin(): Promise<void> {}

  // 네이버 로그인 콜백
  @ApiOperation({
    summary: '네이버 로그인 콜백',
    description: '네이버 로그인 콜백 주소',
  })
  @ApiResponse({
    description: 'JWT accessToken 반환',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyjHskdjqk2kjakdjiqkljLKKKKKDjjdswioque',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '이미 가입된 상태입니다.',
  })
  @UseGuards(NaverAuthGuard)
  @Get('/naver/callback')
  async naverCallback(
    @SocialUser() socialUser: SocialUserAfterAuth,
    @Res() res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.naverLogin({
      socialLoginDto: socialUser,
    });

    // res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    console.log(`accessToken 확인 : ${accessToken}`);
    console.log(`refreshToken 확인 : ${refreshToken}`);

    res.send('<script>window.close()</script>');
  }

  @ApiOperation({
    summary: '이메일 로그인',
    description: '이메일과 비밀번호를 통해 로그인',
  })
  @ApiResponse({
    description: 'JWT accessToken 반환',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyjHskdjqk2kjakdjiqkljLKKKKKDjjdswioque',
        },
        nickName: {
          type: 'string',
          example: '닉네임',
        },
        imageUrl: {
          type: 'string',
          example: 'haru 이미지.jpeg',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '로그인 또는 비밀번호를 다시 입력해주세요.',
  })
  @Post('login/email')
  async emailLogin(
    @Body() emailLoginDto: EmailLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    accessToken: string;
    nickName: string;
    imageUrl: ImageUrlDto | null;
    tier: string;
  }> {
    const { accessToken, refreshToken, nickName, imageUrl, tier } =
      await this.authService.emailLogin(emailLoginDto);

    // res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    console.log(`accessToken 확인 : ${accessToken}`);
    console.log(`refreshToken 확인 : ${refreshToken}`);

    this.logger.debug(`${nickName} 닉네임 확인 `);
    this.logger.debug(imageUrl);

    return { accessToken, nickName, imageUrl, tier };
  }

  @ApiOperation({
    summary: '이메일 회원가입',
    description: '회원가입 버튼을 누를 시 동작하는 이메일 회원가입',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
  })
  @ApiResponse({
    status: 400,
    description: '회원가입 실패',
  })
  @Post('signup/email')
  async emailSignUp(@Body() emailSignUpDto: EmailSignUpDto, @Res() res: Response): Promise<void> {
    const isSignUpSuccess = await this.authService.EmailSignUp(emailSignUpDto, AuthType.EMAIL);

    // 회원가입 성공 시 메인 페이지(로그인 페이지)로 이동 후 true 반환
    if (isSignUpSuccess) {
      res.status(200).send('회원가입 성공');
    }

    res.status(400).send('회원가입 실패');
  }

  @ApiOperation({
    summary: '이메일 중복확인',
    description: '중복확인 버튼을 통해 중복되면 false 반환',
  })
  @ApiResponse({
    status: 201,
    description: 'true / false',
  })
  @Post('check/email')
  async isEmailExists(@Body() emailCheckDto: EmailCheckDto): Promise<boolean> {
    return await this.authService.isEmailExists(emailCheckDto);
  }

  @ApiOperation({
    summary: 'accessToken 재발급',
    description: 'DB에 저장된 refreshToken으로 새로운 accessToken 발급',
  })
  @ApiResponse({
    description: '새로운 JWT accessToken 반환',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyjHskdjqk2kjakdjiqkljLKKKKKDjjdswioque',
        },
        nickName: {
          type: 'string',
          example: '닉네임',
        },
        imageUrl: {
          type: 'string',
          example: 'haru 이미지.jpeg',
        },
      },
    },
  })
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<{
    accessToken: string;
    nickName: string;
    imageUrl: ImageUrlDto | null;
    tier: string;
  }> {
    const refreshToken = req.cookies['refreshToken'];
    this.logger.debug(`refreshToken 확인 : ${refreshToken}`);
    const newInfo = await this.authService.refresh(refreshToken);

    // res.cookie('accessToken', newAccessToken.accessToken, { httpOnly: true });

    return {
      accessToken: newInfo.accessToken,
      nickName: newInfo.nickName,
      imageUrl: newInfo.imageUrl,
      tier: newInfo.tier,
    };
  }

  @ApiOperation({
    summary: '로그아웃',
    description:
      '로그아웃 버튼을 누르면 쿠키의 refreshToken과 accessToken이 삭제되고 DB에 있는 refreshToken도 null로 변경',
  })
  @ApiResponse({
    status: 201,
    description: '로그아웃 성공!',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh Token이 존재하지 않습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '유효하지 않은 Refresh Token입니다.',
  })
  @Post('/logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req: any, @Res() res: Response): Promise<any> {
    this.logger.debug('로그아웃 컨트롤러 시작');
    this.logger.debug(`${req.user.id} 확인`);
    await this.authService.removeRefreshToken(req.user.userId);
    // res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    this.logger.debug('로그아웃 컨트롤라 종료');
    return res.send({
      message: '로그아웃 성공!',
    });
  }

  // 인증/인가 테스트용 API
  @Get('/test')
  // 로그인된 사용자만 가능
  @UseGuards(AuthGuard('jwt'))
  testJwt(@getUser() user: UserEntity) {
    console.log('user', user);
    return '인증 통과';
  }
}
