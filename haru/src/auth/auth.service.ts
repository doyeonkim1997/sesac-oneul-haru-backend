import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailRepository } from 'src/mail/mail.repository';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { AuthRepository } from './auth.repository';
import { EmailCheckDto } from './dto/email-check-dto';
import { EmailLoginDto } from './dto/email-login-dto';
import { EmailSignUpDto } from './dto/email-signup-dto';
import { FindUserInfoDto } from './dto/find-user-info-dto';
import { AuthType } from './enum/auth-type';
import {
  IAuthServiceSocialLoginInput,
  IAuthServiceSocialLoginOutput,
} from './interfaces/iauth-service-social-login';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailRepository: MailRepository,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
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
      const accessToken = await this.createAccessToken({ email: createdUser.email });
      const refreshToken = await this.createRefreshToken({ userId: createdUser.userId });
      // refreshToken 저장
      await this.authRepository.setRefreshToken(refreshToken, createdUser.userId);

      return { accessToken, refreshToken };
    }

    if (user.authType !== String(AuthType.KAKAO)) {
      throw new BadRequestException('이미 가입된 상태입니다.');
    }

    const accessToken = await this.createAccessToken({ email: user.email });
    const refreshToken = await this.createRefreshToken({ userId: user.userId });

    // refreshToken 저장
    await this.authRepository.setRefreshToken(refreshToken, user.userId);

    return { accessToken, refreshToken };
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
      const accessToken = await this.createAccessToken({ email: createdUser.email });
      const refreshToken = await this.createRefreshToken({ userId: createdUser.userId });

      // refreshToken 저장
      await this.authRepository.setRefreshToken(refreshToken, createdUser.userId);

      return { accessToken, refreshToken };
    }

    if (user.authType !== String(AuthType.GOOGLE)) {
      throw new BadRequestException('이미 가입된 상태입니다.');
    }

    const accessToken = await this.createAccessToken({ email: user.email });
    const refreshToken = await this.createRefreshToken({ userId: user.userId });

    // refreshToken 저장
    await this.authRepository.setRefreshToken(refreshToken, user.userId);

    return { accessToken, refreshToken };
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
      const accessToken = await this.createAccessToken({ email: createdUser.email });
      const refreshToken = await this.createRefreshToken({ userId: createdUser.userId });

      // refreshToken 저장
      await this.authRepository.setRefreshToken(refreshToken, createdUser.userId);

      return { accessToken, refreshToken };
    }

    if (user.authType !== String(AuthType.NAVER)) {
      throw new BadRequestException('이미 가입된 상태입니다.');
    }

    const accessToken = await this.createAccessToken({ email: user.email });
    const refreshToken = await this.createRefreshToken({ userId: user.userId });

    // refreshToken 저장
    await this.authRepository.setRefreshToken(refreshToken, user.userId);

    return { accessToken, refreshToken };
  }

  // 이메일 로그인
  async emailLogin(
    emailLoginDto: EmailLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = emailLoginDto;
    const user = await this.authRepository.findByEmail({ email });

    // 유저가 있는지 확인하고 비밀번호가 일치하는지 확인
    if (user && (await bcrypt.compare(password, user.password))) {
      // accessToken 생성
      const accessToken = await this.createAccessToken({ email });
      const refreshToken = await this.createRefreshToken({ userId: user.userId });

      // refreshToken 저장
      await this.authRepository.setRefreshToken(refreshToken, user.userId);

      return { accessToken, refreshToken };
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

    const createUser = await this.authRepository.createUser({
      createUserDto: { email, hashedPassword, nickName },
      authType, // 해당 인증 타입으로 회원가입
    });

    await this.setDefaultImage(createUser.userId);

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

  // accessToken 재발급용
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    this.logger.debug('refresh 메서드 시작');

    const decodedRefreshToken = await this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const userId = Number(decodedRefreshToken.userId);

    const user = await this.getUserIfRefreshTokenMatches(refreshToken, userId);

    if (!user) {
      throw new UnauthorizedException('accessToken을 생성할 수 없습니다.');
    }

    const accessToken = await this.createAccessToken({ email: user.email });

    this.logger.debug('refresh 메서드 종료');

    return { accessToken };
  }

  // refreshToken 유효성 검증
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<FindUserInfoDto | null> {
    this.logger.debug('유효성 검증 시작');
    const user = await this.authRepository.findByUserId(userId);

    if (!user?.refreshToken) {
      this.logger.debug('refreshToken이 없음');
      return null;
    }

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);

    if (isRefreshTokenMatching) {
      this.logger.debug('refreshToken 검증 통과');
      return user;
    }

    this.logger.debug('refresh 검증 실패');
    return null;
  }

  // refreshToken 제거 (로그아웃)
  async removeRefreshToken(userId: number): Promise<any> {
    this.logger.debug('removeRefreshToken 메서드 호출');
    return await this.authRepository.deleteRefreshToken(userId);
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

    await this.setDefaultImage(user.userId);

    return user;
  }

  // 회원가입 시 기본 이미지 설정용 함수
  private async setDefaultImage(userId: number) {
    const image = await this.userRepository.findImageById(1);

    if (!image?.imageUrl) {
      throw new InternalServerErrorException('먼저 기본 이미지를 DB에 저장해주세요.');
    }

    // 기본 이미지 설정
    await this.userService.uploadUserImage(userId, image.imageUrl);
  }

  // accessToken
  private async createAccessToken(payload: { email: string }): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  // refreshToken
  // 유저 정보는 안 담는게 좋으므로 userId만 저장
  private async createRefreshToken(payload: { userId: number }): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }
}
