import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/user/user.module';
import { MailRepository } from './mail.repository';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
          },
          secure: false,
        },
        defaults: {
          from: `Haru <${process.env.EMAIL_ADDRESS}>`,
        },
      }),
    }),
    UserModule,
  ],
  providers: [MailService, MailRepository],
  controllers: [MailController],
})
export class MailModule {}
