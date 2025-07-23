import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // PrismaService의 인스턴스 생성(초기화)되면 $connect 함수를 통해 DB와 연결
  async onModuleInit() {
    await this.$connect();
  }

  // 작은 프로젝트, NestJS만 사용하는 경우:

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
