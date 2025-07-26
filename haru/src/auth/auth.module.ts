import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { KakaoStrategy } from './strategies/kakao-strategy';
import { AuthRepository } from './auth.repository';
import { GoogleStrategy } from './strategies/google-strategy';
import { NaverStrategy } from './strategies/naver-strategy';
import { MailRepository } from 'src/mail/mail.repository';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    MailRepository,
    KakaoStrategy,
    GoogleStrategy,
    NaverStrategy,
  ],
})
export class AuthModule {}
