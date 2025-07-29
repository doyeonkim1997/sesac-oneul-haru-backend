import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './public/image', // 이미지 저장 폴더
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 최대 10MB 제한
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/image\/(jpeg|png|gif)/)) {
      return callback(new Error('jpeg, png, gif 이미지 파일만 업로드 가능합니다.'), false);
    }
    callback(null, true);
  },
};
