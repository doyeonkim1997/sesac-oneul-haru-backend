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
import { JwtStrategy } from './strategies/jwt-strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    MailRepository,
    KakaoStrategy,
    GoogleStrategy,
    NaverStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
