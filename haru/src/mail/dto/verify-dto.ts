import { PickType } from '@nestjs/swagger';
import { EmailVerificationEntity } from '../entity/email-verification.entity';

export class VerifyDto extends PickType(EmailVerificationEntity, ['email', 'validCode'] as const) {}
