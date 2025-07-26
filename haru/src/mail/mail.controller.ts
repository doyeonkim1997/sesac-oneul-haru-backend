import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyDto } from './dto/verify-dto';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail-dto';

@UsePipes(ValidationPipe)
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({
    summary: '이메일 인증 코드 전송',
    description: '이메일 인증 코드 전송용 API.',
  })
  @ApiResponse({
    type: String,
  })
  @Post('/send')
  async sendMail(@Body('email') email: SendMailDto): Promise<string> {
    await this.mailService.sendEmail(email);
    return '인증 메일을 발송했습니다.';
  }

  @ApiOperation({
    summary: '인증코드 검증',
    description: '인증코드로 이메일 검증',
  })
  @ApiResponse({
    type: Boolean,
  })
  @Post('/verify')
  async emailCertified(@Body() verifyDto: VerifyDto): Promise<boolean> {
    const { email, validCode } = verifyDto;
    return await this.mailService.verifyCode(validCode, email);
  }
}
