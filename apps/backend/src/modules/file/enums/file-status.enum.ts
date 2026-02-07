/**
 * File status enumeration
 * Defines the status states for file processing
 */

export enum FileStatus {
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
  DELETED = 'deleted',
}

/**
 * File status display names
 */
export const FileStatusDisplay: Record<FileStatus, string> = {
  [FileStatus.UPLOADING]: 'Uploading',
  [FileStatus.UPLOADED]: 'Uploaded',
  [FileStatus.PROCESSING]: 'Processing',
  [FileStatus.PROCESSED]: 'Processed',
  [FileStatus.FAILED]: 'Failed',
  [FileStatus.DELETED]: 'Deleted',
};

/**
 * Check if file is in a terminal state
 */
export function isTerminalStatus(status: FileStatus): boolean {
  return (
    status === FileStatus.PROCESSED ||
    status === FileStatus.FAILED ||
    status === FileStatus.DELETED
  );
}
