import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 유효성 검사 전역으로 사용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // DTO에 없는 값 제거 하지 않음
      forbidNonWhitelisted: true, // DTO에 없는 값 있을 시 에러 처리
    }),
  );

  // Swagger 관련 세팅
  const options = new DocumentBuilder()
    .setTitle('Haru Project')
    .setDescription('Haru 프로젝트 API 문서')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
