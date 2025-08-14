import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { FindEmailDto } from './dto/find-email-dto';

@Injectable()
export class MailRepository {
  private logger = new Logger('MailRepository');

  constructor(private readonly prisma: PrismaService) {}

  // 이메일이 존재하는지 확인하는 메서드
  async existsByEmail(email: string): Promise<FindEmailDto | null> {
    const result = await this.prisma.emailVerification.findFirst({
      where: { email },
      select: { email: true, expirationTime: true, validCode: true, emailId: true },
    });

    if (!result) return null;

    // 명시적 DTO 매핑
    const mapped: FindEmailDto = {
      emailId: result.emailId,
      email: result.email,
      validCode: result.validCode,
      expirationTime: result.expirationTime ?? null,
    };

    this.logger.log(`${mapped.email} 이메일 mailRepository 통과됨`);
    return mapped;
  }

  // 이메일 저장
  async createEmail(email: string, tempCode: string, expirationTime: Date): Promise<void> {
    await this.prisma.emailVerification.create({
      data: {
        email: email,
        validCode: tempCode,
        expirationTime,
      },
    });
  }

  // 소셜 로그인 시 이메일 저장
  async createSocialEmail(email: string): Promise<void> {
    await this.prisma.emailVerification.create({
      data: {
        email: email,
        validCode: 'social',
        expirationTime: new Date(),
      },
    });
  }

  // 이메일 인증 시 이메일 인증 상태 통과로 변경
  async updateEmailVerified(emailId: number): Promise<void> {
    await this.prisma.emailVerification.update({
      where: {
        emailId,
      },
      data: {
        isVerified: true,
      },
    });
  }

  // 검증 후 삭제용
  async deleteEmailById(emailId: number): Promise<void> {
    await this.prisma.emailVerification.delete({
      where: {
        emailId: emailId,
      },
    });
  }
}
