/**
 * Memory status enumeration
 * Defines the processing status of memories
 */

export enum MemoryStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

/**
 * Memory status display names
 */
export const MemoryStatusDisplay: Record<MemoryStatus, string> = {
  [MemoryStatus.DRAFT]: 'Draft',
  [MemoryStatus.PROCESSING]: 'Processing',
  [MemoryStatus.PROCESSED]: 'Processed',
  [MemoryStatus.ARCHIVED]: 'Archived',
  [MemoryStatus.DELETED]: 'Deleted',
};

/**
 * Check if memory is in a terminal state
 */
export function isTerminalStatus(status: MemoryStatus): boolean {
  return (
    status === MemoryStatus.PROCESSED ||
    status === MemoryStatus.ARCHIVED ||
    status === MemoryStatus.DELETED
  );
}
