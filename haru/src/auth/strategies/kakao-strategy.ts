import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email', 'profile_nickname'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const kakaoAccount = profile._json.kakao_account;

    // 토큰 프로필 확인 용
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    console.log(profile);

    // 이메일, 비밀번호, 닉네임 반환
    return {
      email: kakaoAccount.email,
      password: String(profile.id),
      nickName: kakaoAccount.profile?.nickname || `kakao_${Date.now()}`,
    };
  }
}
