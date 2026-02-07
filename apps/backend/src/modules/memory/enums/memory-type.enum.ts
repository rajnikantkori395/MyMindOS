/**
 * Memory type enumeration
 * Defines the types of memories stored
 */

export enum MemoryType {
  FILE = 'file',
  NOTE = 'note',
  CHAT = 'chat',
  TASK = 'task',
  EVENT = 'event',
  CONTACT = 'contact',
  BOOKMARK = 'bookmark',
  OTHER = 'other',
}

/**
 * Memory type display names
 */
export const MemoryTypeDisplay: Record<MemoryType, string> = {
  [MemoryType.FILE]: 'File',
  [MemoryType.NOTE]: 'Note',
  [MemoryType.CHAT]: 'Chat',
  [MemoryType.TASK]: 'Task',
  [MemoryType.EVENT]: 'Event',
  [MemoryType.CONTACT]: 'Contact',
  [MemoryType.BOOKMARK]: 'Bookmark',
  [MemoryType.OTHER]: 'Other',
};
