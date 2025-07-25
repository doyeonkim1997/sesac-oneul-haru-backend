import { SocialUserAfterAuth } from '../user.decorator';

// 소셜 로그인 시 매개변수 dto
export interface IAuthServiceSocialLoginInput {
  socialLoginDto: SocialUserAfterAuth;
}

// 소셜 로그인 시 반환될 dto
export interface IAuthServiceSocialLoginOutput {
  accessToken: string;
  // refreshToken: string;
}
