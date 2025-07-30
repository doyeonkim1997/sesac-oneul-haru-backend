import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    description: '인증 메일을 발송했습니다.',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: '이메일 전송 중 오류가 발생했습니다. 에러 : 에러코드',
  })
  @Post('/send')
  async sendMail(@Body() email: SendMailDto): Promise<string> {
    await this.mailService.sendEmail(email);
    return '인증 메일을 발송했습니다.';
  }

  @ApiOperation({
    summary: '인증코드 검증',
    description: '인증코드로 이메일 검증',
  })
  @ApiResponse({
    description: '이메일 인증 성공 여부 true / false',
    status: 200,
    type: Boolean,
  })
  @Post('/verify')
  async emailCertified(@Body() verifyDto: VerifyDto): Promise<boolean> {
    const { email, validCode } = verifyDto;
    return await this.mailService.verifyCode(validCode, email);
  }
}
