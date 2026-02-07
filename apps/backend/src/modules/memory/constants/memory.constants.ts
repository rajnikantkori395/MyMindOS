/**
 * Memory Module Constants
 */

// Chunking configuration
export const CHUNKING_CONFIG = {
  MAX_CHUNK_SIZE: 1000, // characters
  CHUNK_OVERLAP: 200, // characters
  MIN_CHUNK_SIZE: 100, // characters
} as const;

// Search configuration
export const SEARCH_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_SIMILARITY_THRESHOLD: 0.7,
  MIN_SIMILARITY_THRESHOLD: 0.0,
  MAX_SIMILARITY_THRESHOLD: 1.0,
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Vector dimensions (will be set based on embedding model)
export const VECTOR_DIMENSIONS = 1536; // OpenAI ada-002 default

// Memory metadata keys
export const METADATA_KEYS = {
  SOURCE: 'source',
  SOURCE_ID: 'sourceId',
  SOURCE_TYPE: 'sourceType',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  TAGS: 'tags',
  CATEGORY: 'category',
  PRIORITY: 'priority',
} as const;
