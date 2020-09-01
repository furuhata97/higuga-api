import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const nameWithoutSpace = file.originalname.replace(/\s/g, '');
      const fileName = `${fileHash}-${nameWithoutSpace}`;

      return callback(null, fileName);
    },
  }),
};
