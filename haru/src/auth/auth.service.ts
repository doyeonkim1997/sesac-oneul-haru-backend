import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import {
  IAuthServiceSocialLoginInput,
  IAuthServiceSocialLoginOutput,
} from './interfaces/iauth-service-social-login';
import { JwtService } from '@nestjs/jwt';
import { AuthType } from './enum/auth-type';
import * as bcrypt from 'bcryptjs';
import { EmailLoginDto } from './dto/email-login-dto';
import { MailRepository } from 'src/mail/mail.repository';
import { EmailSignUpDto } from './dto/email-signup-dto';
import { EmailCheckDto } from './dto/email-check-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailRepository: MailRepository,
    private readonly jwtService: JwtService,
  ) {}

  // 카카오 로그인
  async kakaoLogin({
    socialLoginDto,
  }: IAuthServiceSocialLoginInput): Promise<IAuthServiceSocialLoginOutput> {
    const { email, password, nickName } = socialLoginDto;
    // 유저를 찾아봄
    const user = await this.authRepository.findByEmail({ email });

    // 가입된 유저가 아니면 회원가입
    if (!user) {
      const createdUser = await this.signUp(password, email, nickName, AuthType.KAKAO);
      const accessToken = this.createAccessToken({ email: createdUser.email });
      return { accessToken };
    }

    if (user.authType !== AuthType.KAKAO) {
      throw new BadRequestException('이미 가입된 상태입니다.');
    }

    // accessToken 생성
    const accessToken = this.createAccessToken({ email: user.email });
    // const refreshToken = this.getRefreshToken({ userId: user.userId });

    // accessToken 반환
    return { accessToken };
  }

  // 구글 로그인
  async googleLogin({
    socialLoginDto,
  }: IAuthServiceSocialLoginInput): Promise<IAuthServiceSocialLoginOutput> {
    const { email, password, nickName } = socialLoginDto;
    const user = await this.authRepository.findByEmail({ email });

    // 가입된 유저가 아니면 회원가입
    if (!user) {
      const createdUser = await this.signUp(password, email, nickName, AuthType.GOOGLE);
      const accessToken = this.createAccessToken({ email: createdUser.email });
      return { accessToken };
    }

    if (user.authType !== AuthType.GOOGLE) {
      throw new BadRequestException('이미 가입된 상태입니다.');
    }

    const accessToken = this.createAccessToken({ email: user.email });
    // const refreshToken = this.getRefreshToken({ userId: user.userId });

    return { accessToken };
  }

  // 네이버 로그인
  async naverLogin({
    socialLoginDto,
  }: IAuthServiceSocialLoginInput): Promise<IAuthServiceSocialLoginOutput> {
    const { email, password, nickName } = socialLoginDto;
    const user = await this.authRepository.findByEmail({ email });

    // 가입된 유저가 아니면 회원가입
    if (!user) {
      const createdUser = await this.signUp(password, email, nickName, AuthType.NAVER);
      const accessToken = this.createAccessToken({ email: createdUser.email });
      return { accessToken };
    }

    if (user.authType !== AuthType.NAVER) {
      throw new BadRequestException('이미 가입된 상태입니다.');
    }

    const accessToken = this.createAccessToken({ email: user.email });
    // const refreshToken = this.getRefreshToken({ userId: user.userId });

    return { accessToken };
  }

  // 이메일 로그인
  async emailLogin(emailLoginDto: EmailLoginDto): Promise<{ accessToken: string }> {
    const { email, password } = emailLoginDto;
    const user = await this.authRepository.findByEmail({ email });

    // 유저가 있는지 확인하고 비밀번호가 일치하는지 확인
    if (user && (await bcrypt.compare(password, user.password))) {
      // accessToken 생성
      const accessToken = this.createAccessToken({ email });

      return { accessToken };
    } else {
      throw new UnauthorizedException('로그인 또는 비밀번호를 다시 입력해주세요.');
    }
  }

  // 회원가입 (이메일)
  async EmailSignUp(emailSignUpDto: EmailSignUpDto, authType: AuthType): Promise<boolean> {
    const { email, password, confirmPassword, nickName } = emailSignUpDto;

    const user = await this.authRepository.findByEmail({ email });

    if (user) {
      throw new BadRequestException('이미 가입된 상태입니다.');
    }

    // 비밀번호 일치하는지 확인
    if (password !== confirmPassword) {
      return false;
    }

    const isValidEmail = await this.mailRepository.existsByEmail(email);

    // 이메일이 인증됐는지 확인
    if (!isValidEmail) {
      return false;
    }

    // 이메일 검증 후 컬럼 삭제
    await this.mailRepository.deleteEmailById(isValidEmail.emailId);

    // 비밀번호 해싱해서 저장
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.authRepository.createUser({
      createUserDto: { email, hashedPassword, nickName },
      authType, // 해당 인증 타입으로 회원가입
    });

    return true;
  }

  // 이메일 중복 확인
  async isEmailExists(emailCheckDto: EmailCheckDto): Promise<boolean> {
    const { email } = emailCheckDto;
    const isValidEmail = await this.authRepository.findByEmail({ email });

    if (isValidEmail) {
      return false;
    }

    return true;
  }

  // 회원가입 (카카오, 구글, 네이버)
  private async signUp(password: string, email: string, nickName: string, authType: AuthType) {
    // 비밀번호 해싱해서 저장
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.authRepository.createUser({
      createUserDto: { email, hashedPassword, nickName },
      authType, // 해당 인증 타입으로 회원가입
    });
    return user;
  }

  // accessToken 생성 1시간
  private createAccessToken(payload: { email: string }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });
  }

  // refreshToken 생성 7일
  private createRefreshToken(payload: { email: string }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }
}
