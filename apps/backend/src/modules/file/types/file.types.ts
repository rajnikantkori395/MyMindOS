import { FileStatus, FileType } from '../enums';

/**
 * File metadata interface
 */
export interface FileMetadata {
  filename: string;
  mimeType: string;
  size: number;
  checksum?: string;
  storageKey: string;
  storageProvider: 's3' | 'minio' | 'local';
  url?: string;
  thumbnailUrl?: string;
}

/**
 * File extraction result
 */
export interface ExtractionResult {
  text?: string;
  metadata?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  processedAt?: Date;
}

/**
 * Create file input
 */
export interface CreateFileInput {
  userId: string;
  filename: string;
  mimeType: string;
  size: number;
  checksum?: string;
  storageKey: string;
  storageProvider: 's3' | 'minio' | 'local';
  url?: string;
  thumbnailUrl?: string;
  type: FileType;
  status: FileStatus;
  metadata?: Record<string, any>;
  extractionResult?: ExtractionResult;
}

/**
 * Update file input
 */
export interface UpdateFileInput {
  filename?: string;
  status?: FileStatus;
  url?: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  extractionResult?: ExtractionResult;
  processedAt?: Date;
}

/**
 * File query filters
 */
export interface FileQueryFilters {
  userId?: string;
  type?: FileType;
  status?: FileStatus;
  mimeType?: string;
  search?: string; // Search in filename
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Presigned URL response
 */
export interface PresignedUrlResponse {
  uploadUrl: string;
  fileId?: string;
  expiresIn: number;
}
