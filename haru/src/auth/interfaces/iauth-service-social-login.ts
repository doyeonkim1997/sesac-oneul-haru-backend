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

// 회원가입 시 매개변수
export interface UserWithVerification {
  email: string;
  password: string;
  nickName: string;
  userId: number;
  AuthType: string;
  tier: string;
  createdAt: Date;
  updatedAt: Date | null;
  imageId: number | null;
  verificationCode: string | null;
  expirationTime: Date | null;
}
