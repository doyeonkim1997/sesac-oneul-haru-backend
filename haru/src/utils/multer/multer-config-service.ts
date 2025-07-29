// import { Injectable } from '@nestjs/common';
// import { MulterOptionsFactory } from '@nestjs/platform-express';
// import multer from 'multer';
// import path from 'path';

// Injectable();
// export class MulterConfigService implements MulterOptionsFactory {
//   dirPath: string;
//   constructor() {
//     this.dirPath = path.join(process.cwd(), 'public/image');
//     // this.mkdir();
//   }

//   // uploads 폴더 생성
//   // mkdir() {
//   //   try {
//   //     fs.readdirSync(this.dirPath);
//   //   } catch (e) {
//   //     fs.mkdirSync(this.dirPath);
//   //   }
//   // }

//   createMulterOptions() {
//     const dirPath = this.dirPath;
//     const option = {
//       storage: multer.diskStorage({
//         destination(req, file, done) {
//           //파일 저장 경로 설정
//           done(null, dirPath);
//         },

//         filename(req, file, done) {
//           // 파일명 설정
//           const ext = path.extname(file.originalname);
//           const name = path.basename(file.originalname, ext);
//           done(null, `${name}_${Date.now()}${ext}`); //파일이름_날짜.확장자
//         },
//       }),
//       limits: { fileSize: 10 * 1024 * 1024 }, // 용량 제한 10MB
//     };
//     return option;
//   }
// }
