import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileRepository } from './repositories/file.repository';
import { StorageService } from './services/storage.service';
import { LoggerService } from '../../common/logger/logger.service';
import {
  CreateFileInput,
  UpdateFileInput,
  FileQueryFilters,
  PaginationOptions,
  PaginatedResponse,
  PresignedUrlResponse,
} from './types/file.types';
import { File } from './schemas/file.schema';
import { FileStatus, FileType, getFileTypeFromMime } from './enums';
import {
  FILE_SIZE_LIMITS,
  ALLOWED_MIME_TYPES,
  PAGINATION_DEFAULTS,
} from './constants/file.constants';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly storageService: StorageService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Generate presigned URL for file upload
   */
  async generatePresignedUrl(
    userId: string,
    filename: string,
    mimeType: string,
    size: string,
    type?: FileType,
    expiresIn?: number,
  ): Promise<PresignedUrlResponse> {
    this.logger.log('Generating presigned URL', 'FileService', {
      userId,
      filename,
      mimeType,
      size,
    });

    // Validate file size
    const fileSize = parseInt(size, 10);
    if (isNaN(fileSize) || fileSize <= 0) {
      throw new BadRequestException('Invalid file size');
    }

    if (fileSize > FILE_SIZE_LIMITS.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${FILE_SIZE_LIMITS.MAX_FILE_SIZE} bytes`,
      );
    }

    // Validate MIME type
    this.validateMimeType(mimeType);

    // Determine file type if not provided
    const fileType = type || getFileTypeFromMime(mimeType);

    // Generate storage key
    const storageKey = this.storageService.generateStorageKey(
      userId,
      filename,
    );

    // Generate presigned URL
    const uploadUrl = await this.storageService.generatePresignedUploadUrl(
      storageKey,
      mimeType,
      expiresIn || 3600,
    );

    // Create file record
    const file = await this.fileRepository.create({
      userId,
      filename,
      mimeType,
      size: fileSize,
      storageKey,
      storageProvider: 'minio',
      type: fileType,
      status: FileStatus.UPLOADING,
      metadata: {},
      extractionResult: {
        status: 'pending',
      },
    });

    this.logger.log('Presigned URL generated', 'FileService', {
      fileId: file.id,
      storageKey,
    });

    return {
      uploadUrl,
      fileId: file.id,
      expiresIn: expiresIn || 3600,
    };
  }

  /**
   * Upload file directly (multipart/form-data)
   */
  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    type?: FileType,
  ): Promise<File> {
    this.logger.log('Uploading file', 'FileService', {
      userId,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    });

    // Validate file size
    if (file.size > FILE_SIZE_LIMITS.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${FILE_SIZE_LIMITS.MAX_FILE_SIZE} bytes`,
      );
    }

    // Validate MIME type
    this.validateMimeType(file.mimetype);

    // Determine file type
    const fileType = type || getFileTypeFromMime(file.mimetype);

    // Generate storage key
    const storageKey = this.storageService.generateStorageKey(
      userId,
      file.originalname,
    );

    // Calculate checksum
    const checksum = this.storageService.calculateChecksum(file.buffer);

    // Upload to storage
    await this.storageService.uploadFile(
      storageKey,
      file.buffer,
      file.mimetype,
    );

    // Generate download URL
    const url = await this.storageService.generatePresignedDownloadUrl(
      storageKey,
      3600,
    );

    // Create file record
    const fileRecord = await this.fileRepository.create({
      userId,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      checksum,
      storageKey,
      storageProvider: 'minio',
      url,
      type: fileType,
      status: FileStatus.UPLOADED,
      metadata: {},
      extractionResult: {
        status: 'pending',
      },
    });

    this.logger.business('file_uploaded', {
      fileId: fileRecord.id,
      userId,
      filename: file.originalname,
      size: file.size,
      type: fileType,
    });

    return fileRecord;
  }

  /**
   * Mark file as uploaded (after presigned URL upload)
   */
  async markFileAsUploaded(fileId: string, userId: string): Promise<File> {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this file');
    }

    if (file.status !== FileStatus.UPLOADING) {
      throw new BadRequestException('File is not in uploading status');
    }

    // Generate download URL
    const url = await this.storageService.generatePresignedDownloadUrl(
      file.storageKey,
      3600,
    );

    const updated = await this.fileRepository.updateById(fileId, {
      status: FileStatus.UPLOADED,
      url,
    });

    if (!updated) {
      throw new NotFoundException('File not found');
    }

    this.logger.log('File marked as uploaded', 'FileService', {
      fileId,
      userId,
    });

    return updated;
  }

  /**
   * Get file by ID
   */
  async findById(id: string, userId: string): Promise<File> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.userId !== userId) {
      throw new ForbiddenException('Not authorized to access this file');
    }

    // Generate fresh download URL if needed
    if (!file.url || file.status === FileStatus.UPLOADED) {
      const url = await this.storageService.generatePresignedDownloadUrl(
        file.storageKey,
        3600,
      );
      await this.fileRepository.updateById(id, { url });
      file.url = url;
    }

    return file;
  }

  /**
   * Get files with pagination
   */
  async findAll(
    userId: string,
    filters: FileQueryFilters = {},
    pagination: PaginationOptions = {
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
    },
  ): Promise<PaginatedResponse<File>> {
    return this.fileRepository.findMany(
      { ...filters, userId },
      pagination,
    );
  }

  /**
   * Get download URL for file
   */
  async getDownloadUrl(id: string, userId: string): Promise<string> {
    const file = await this.findById(id, userId);
    return this.storageService.generatePresignedDownloadUrl(
      file.storageKey,
      3600,
    );
  }

  /**
   * Delete file
   */
  async delete(id: string, userId: string): Promise<void> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this file');
    }

    // Soft delete
    await this.fileRepository.deleteById(id);

    // Delete from storage (async, don't wait)
    this.storageService.deleteFile(file.storageKey).catch((error) => {
      this.logger.error(
        'Failed to delete file from storage',
        error instanceof Error ? error.stack : String(error),
        'FileService',
        { fileId: id, storageKey: file.storageKey },
      );
    });

    this.logger.log('File deleted', 'FileService', { fileId: id, userId });
  }

  /**
   * Get storage usage for user
   */
  async getStorageUsage(userId: string): Promise<{
    totalBytes: number;
    totalFiles: number;
    limitBytes: number;
  }> {
    const totalBytes = await this.fileRepository.getTotalStorageUsed(userId);
    const totalFiles = await this.fileRepository.count({ userId });
    const limitBytes = FILE_SIZE_LIMITS.MAX_FILE_SIZE * 100; // 10 GB default limit

    return {
      totalBytes,
      totalFiles,
      limitBytes,
    };
  }

  /**
   * Validate MIME type
   */
  private validateMimeType(mimeType: string): void {
    const allAllowed: readonly string[] = [
      ...ALLOWED_MIME_TYPES.DOCUMENTS,
      ...ALLOWED_MIME_TYPES.IMAGES,
      ...ALLOWED_MIME_TYPES.AUDIO,
      ...ALLOWED_MIME_TYPES.VIDEO,
      ...ALLOWED_MIME_TYPES.ARCHIVES,
    ];

    if (!allAllowed.includes(mimeType)) {
      throw new BadRequestException(
        `File type ${mimeType} is not allowed. Allowed types: ${allAllowed.join(', ')}`,
      );
    }
  }
}
