import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { MailRepository } from './mail.repository';
import { SendMailDto } from './dto/send-mail-dto';

@Injectable()
export class MailService {
  private logger = new Logger('MailService');
  constructor(
    private readonly mailRepository: MailRepository,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(sendingEmail: SendMailDto): Promise<void> {
    const { email } = sendingEmail;
    const tempCode = this.generateTempCode();
    const expirationTime = new Date();

    // 유효시간 설정 (5분)
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    // 이메일 인증을 위해 저장
    await this.mailRepository.createEmail(email, tempCode, expirationTime);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Haru 이메일 인증번호',
        html: `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333333;"> 이메일 인증 안내</h2>
      <p style="font-size: 16px; color: #555555;">
        안녕하세요, <strong>하루(Haru)</strong> 서비스를 이용해 주셔서 감사합니다.<br/>
        아래 <strong>인증코드</strong>를 회원가입 또는 이메일 인증 창에 입력해주세요.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 24px; letter-spacing: 4px; padding: 15px 30px; background-color: #f0f0f0; border: 1px dashed #cccccc; border-radius: 8px; color: #333333;">
          ${tempCode}
        </span>
      </div>

      <p style="font-size: 14px; color: #888888;">
        ⏱️ 이 인증코드는 발급 후 5분간 유효합니다.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;"/>

      <p style="font-size: 12px; color: #aaaaaa;">
        본 메일은 발신전용이며, 회신되지 않습니다.<br/>
        궁금한 점이 있다면 홈페이지를 방문해 주세요.
      </p>
    </div>
  </div>
`,
      });

      this.logger.log(`${tempCode} MailService에서 이메일 인증 저장되고 이메일 전송됨`);
    } catch (e) {
      throw new InternalServerErrorException(`이메일 전송 중 오류가 발생했습니다. 에러 : ${e}`);
    }
  }

  // 인증 코드 생성
  private generateTempCode(): string {
    return randomBytes(3).toString('hex').toUpperCase();
  }

  // 코드와 유효기간 검증
  async verifyCode(verificationCode: string, email: string): Promise<boolean> {
    const validEmail = await this.mailRepository.existsByEmail(email);

    this.logger.log(`전달된 email: ${email}`);
    this.logger.log(`전달된 code: ${verificationCode}`);

    this.logger.log(`인증코드 검증 시작`);

    if (!validEmail) {
      this.logger.log(`이메일 인증 정보 없음`);
      return false;
    }

    if (validEmail.validCode !== verificationCode) {
      this.logger.log(`1. 인증 코드 불일치ㄴ`);
      return false;
    }

    if (!validEmail.expirationTime || validEmail.expirationTime < new Date()) {
      this.logger.log(`2. 유효시간 만료`);
      return false;
    }

    this.logger.log(`✅ 인증 통과`);

    // 이메일 인증 상태 변경
    await this.mailRepository.updateEmailVerified(validEmail.emailId);

    // 이메일 검증 후 컬럼 삭제
    // await this.mailRepository.deleteEmailById(validEmail.emailId);

    return true;
  }
}
