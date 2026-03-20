import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.getOrThrow<string>('S3_BUCKET');
    this.publicUrl = this.config.getOrThrow<string>('S3_PUBLIC_URL');

    this.s3 = new S3Client({
      region: this.config.get('S3_REGION', 'auto'),
      endpoint: this.config.getOrThrow<string>('S3_ENDPOINT'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.config.getOrThrow<string>('S3_SECRET_KEY'),
      },
      forcePathStyle: this.config.get('S3_FORCE_PATH_STYLE', 'false') === 'true',
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const key = `${folder}/${uuidv4()}${extname(file.originalname)}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    this.logger.log(`Uploaded: ${key}`);
    return `${this.publicUrl}/${key}`;
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      const key = this.extractKey(fileUrl);
      if (!key) return;

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      this.logger.log(`Deleted: ${key}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file: ${fileUrl}`, error);
    }
  }

  private extractKey(fileUrl: string): string | null {
    if (!fileUrl.startsWith(this.publicUrl)) return null;
    return fileUrl.slice(this.publicUrl.length + 1);
  }
}
