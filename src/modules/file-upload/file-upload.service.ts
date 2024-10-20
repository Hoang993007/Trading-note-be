import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {}

  async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
    const publicPath = this.configService.get<string>('app.publicPath');
    const uploadPath = path.join(publicPath, folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadPath, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    return path.join(folder, fileName);
  }

  async deleteFile(filename: string) {
    // console.log(`[Delete  file] ${filename}`);
    const publicPath = this.configService.get<string>('app.publicPath');
    const filePath = path.join(publicPath, filename);
    await fs.promises.unlink(filePath);
  }
}
