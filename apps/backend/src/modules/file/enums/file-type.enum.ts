/**
 * File type enumeration
 * Defines the types of files supported
 */

export enum FileType {
  DOCUMENT = 'document',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  ARCHIVE = 'archive',
  OTHER = 'other',
}

/**
 * File type display names
 */
export const FileTypeDisplay: Record<FileType, string> = {
  [FileType.DOCUMENT]: 'Document',
  [FileType.IMAGE]: 'Image',
  [FileType.AUDIO]: 'Audio',
  [FileType.VIDEO]: 'Video',
  [FileType.ARCHIVE]: 'Archive',
  [FileType.OTHER]: 'Other',
};

/**
 * Get file type from MIME type
 */
export function getFileTypeFromMime(mimeType: string): FileType {
  if (mimeType.startsWith('text/') || mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes('powerpoint')) {
    return FileType.DOCUMENT;
  }
  if (mimeType.startsWith('image/')) {
    return FileType.IMAGE;
  }
  if (mimeType.startsWith('audio/')) {
    return FileType.AUDIO;
  }
  if (mimeType.startsWith('video/')) {
    return FileType.VIDEO;
  }
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar') || mimeType.includes('archive')) {
    return FileType.ARCHIVE;
  }
  return FileType.OTHER;
}
