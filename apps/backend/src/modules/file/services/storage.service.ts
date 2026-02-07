/**
 * Storage Service
 * Handles file upload/download to S3/MinIO
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../../common/logger/logger.service';
import * as crypto from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.initializeS3Client();
  }

  /**
   * Initialize S3 client
   */
  private initializeS3Client(): void {
    const s3Config = this.configService.get('storage.s3');
    this.bucket = s3Config.bucket;

    this.s3Client = new S3Client({
      endpoint: s3Config.endpoint,
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKey,
        secretAccessKey: s3Config.secretKey,
      },
      forcePathStyle: s3Config.forcePathStyle,
    });

    this.logger.log('Storage service initialized', 'StorageService', {
      provider: this.configService.get('storage.provider'),
      endpoint: s3Config.endpoint,
      bucket: this.bucket,
    });
  }

  /**
   * Generate storage key for file
   */
  generateStorageKey(userId: string, filename: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `uploads/${userId}/${timestamp}-${random}-${sanitizedFilename}`;
  }

  /**
   * Upload file buffer to storage
   */
  async uploadFile(
    storageKey: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: buffer,
        ContentType: mimeType,
      });

      await this.s3Client.send(command);

      this.logger.log('File uploaded to storage', 'StorageService', {
        storageKey,
        size: buffer.length,
        mimeType,
      });

      return storageKey;
    } catch (error) {
      this.logger.error(
        'Failed to upload file',
        error instanceof Error ? error.stack : String(error),
        'StorageService',
        { storageKey, error: error instanceof Error ? error.message : String(error) },
      );
      throw new BadRequestException('Failed to upload file to storage');
    }
  }

  /**
   * Generate presigned URL for upload
   */
  async generatePresignedUploadUrl(
    storageKey: string,
    mimeType: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        ContentType: mimeType,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log('Presigned upload URL generated', 'StorageService', {
        storageKey,
        expiresIn,
      });

      return url;
    } catch (error) {
      this.logger.error(
        'Failed to generate presigned URL',
        error instanceof Error ? error.stack : String(error),
        'StorageService',
        { storageKey, error: error instanceof Error ? error.message : String(error) },
      );
      throw new BadRequestException('Failed to generate presigned URL');
    }
  }

  /**
   * Generate presigned URL for download
   */
  async generatePresignedDownloadUrl(
    storageKey: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log('Presigned download URL generated', 'StorageService', {
        storageKey,
        expiresIn,
      });

      return url;
    } catch (error) {
      this.logger.error(
        'Failed to generate presigned download URL',
        error instanceof Error ? error.stack : String(error),
        'StorageService',
        { storageKey, error: error instanceof Error ? error.message : String(error) },
      );
      throw new BadRequestException('Failed to generate download URL');
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(storageKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      });

      await this.s3Client.send(command);

      this.logger.log('File deleted from storage', 'StorageService', {
        storageKey,
      });
    } catch (error) {
      this.logger.error(
        'Failed to delete file',
        error instanceof Error ? error.stack : String(error),
        'StorageService',
        { storageKey, error: error instanceof Error ? error.message : String(error) },
      );
      // Don't throw - file might already be deleted
    }
  }

  /**
   * Calculate file checksum
   */
  calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
