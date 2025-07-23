import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindUserDto } from './dto/find-user-dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '닉네임으로 사용자 조회',
    description: '닉네임으로 사용자를 조회하며 사용자가 없으면 0의 배열을 반환.',
  })
  @ApiResponse({
    type: FindUserDto,
    isArray: true,
  })
  @Get('/search')
  searchUserByNickName(@Query('search') search: string): Promise<FindUserDto[]> {
    return this.searchUserByNickName(search);
  }
}
