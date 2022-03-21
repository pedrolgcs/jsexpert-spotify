import fs from 'fs';
import fsPromise from 'fs/promises';
import { extname, join } from 'path';
import config from '../config/index.js';

class Service {
  createFileStream(file) {
    return fs.createReadStream(file);
  }

  async getFileInfo(file) {
    const filePath = join(config.directory.publicDirectory, file);

    await fsPromise.access(filePath);
    const fileType = extname(filePath);

    return {
      type: fileType,
      filePath,
    };
  }

  async getFileStream(file) {
    const { type, filePath } = await this.getFileInfo(file);
    const stream = this.createFileStream(filePath);

    return {
      stream,
      type,
    };
  }
}

export { Service };
