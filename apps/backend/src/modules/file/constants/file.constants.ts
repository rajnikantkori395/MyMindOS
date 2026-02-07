/**
 * File Module Constants
 */

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100 MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_DOCUMENT_SIZE: 50 * 1024 * 1024, // 50 MB
  MAX_AUDIO_SIZE: 100 * 1024 * 1024, // 100 MB
  MAX_VIDEO_SIZE: 500 * 1024 * 1024, // 500 MB
} as const;

// Allowed MIME types
export const ALLOWED_MIME_TYPES = {
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/markdown',
    'text/csv',
  ],
  IMAGES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  AUDIO: [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
  ],
  VIDEO: [
    'video/mp4',
    'video/webm',
    'video/ogg',
  ],
  ARCHIVES: [
    'application/zip',
    'application/x-tar',
    'application/gzip',
  ],
} as const;

// Storage paths
export const STORAGE_PATHS = {
  UPLOADS: 'uploads',
  TEMP: 'temp',
  PROCESSED: 'processed',
} as const;

// Presigned URL expiration (in seconds)
export const PRESIGNED_URL_EXPIRATION = 3600; // 1 hour

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
