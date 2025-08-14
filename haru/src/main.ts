import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 쿠키 설정
  app.use(cookieParser());

  // 유효성 검사 전역으로 사용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // DTO에 없는 값 제거 하지 않음
      forbidNonWhitelisted: true, // DTO에 없는 값 있을 시 에러 처리
    }),
  );

  // cors 설정
  app.enableCors({
    origin: [process.env.FRONT_ADDRESS],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 정적 파일 제공 설정
  app.use('/image', express.static(join(__dirname, '..', 'public', 'image')));
  // 예: http://localhost:3000/image/파일이름 으로 접근 가능

  // Swagger 관련 설정
  const options = new DocumentBuilder()
    .setTitle('Haru Project')
    .setDescription('Haru 프로젝트 API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
