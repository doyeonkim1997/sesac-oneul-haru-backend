import { SocialUserAfterAuth } from '../user.decorator';

export interface IAuthServiceSocialLoginInput {
  socialLoginDto: SocialUserAfterAuth;
}

export interface IAuthServiceSocialLoginOutput {
  accessToken: string;
  refreshToken: string;
}
