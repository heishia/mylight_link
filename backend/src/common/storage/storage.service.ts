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
  private s3: S3Client | null = null;
  private bucket = '';
  private publicUrl = '';
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly config: ConfigService) {
    const bucket = this.config.get<string>('S3_BUCKET');
    const endpoint = this.config.get<string>('S3_ENDPOINT');
    const accessKey = this.config.get<string>('S3_ACCESS_KEY');
    const secretKey = this.config.get<string>('S3_SECRET_KEY');
    const publicUrl = this.config.get<string>('S3_PUBLIC_URL');

    if (bucket && endpoint && accessKey && secretKey && publicUrl) {
      this.bucket = bucket;
      this.publicUrl = publicUrl;
      this.s3 = new S3Client({
        region: this.config.get('S3_REGION', 'auto'),
        endpoint,
        credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
        forcePathStyle: this.config.get('S3_FORCE_PATH_STYLE', 'false') === 'true',
      });
      this.logger.log('S3 storage configured');
    } else {
      this.logger.warn('S3 storage not configured — file upload disabled');
    }
  }

  private ensureConfigured(): void {
    if (!this.s3) {
      throw new Error('S3 storage is not configured. Set S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_PUBLIC_URL.');
    }
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    this.ensureConfigured();
    const key = `${folder}/${uuidv4()}${extname(file.originalname)}`;

    await this.s3!.send(
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
    if (!this.s3) return;
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
