import { MemoryType, MemoryStatus } from '../enums';

/**
 * Memory source reference
 */
export interface MemorySource {
  type: 'file' | 'note' | 'chat' | 'task' | 'event' | 'contact' | 'bookmark';
  id: string;
  url?: string;
}

/**
 * Memory embedding information
 */
export interface MemoryEmbedding {
  vectorId?: string; // ID in vector database
  model?: string; // Embedding model used
  dimensions?: number; // Vector dimensions
  generatedAt?: Date;
}

/**
 * Memory insight (AI-generated)
 */
export interface MemoryInsight {
  summary?: string;
  keyPoints?: string[];
  tags?: string[];
  category?: string;
  relatedConcepts?: string[];
  generatedAt?: Date;
}

/**
 * Memory link (relationship to other memories)
 */
export interface MemoryLink {
  targetMemoryId: string;
  relationship: 'related' | 'parent' | 'child' | 'reference' | 'similar';
  strength?: number; // 0-1 similarity score
  createdAt?: Date;
}

/**
 * Create memory input
 */
export interface CreateMemoryInput {
  userId: string;
  title: string;
  content: string;
  type: MemoryType;
  status?: MemoryStatus;
  source?: MemorySource;
  tags?: string[];
  metadata?: Record<string, any>;
  embedding?: MemoryEmbedding;
  insight?: MemoryInsight;
}

/**
 * Update memory input
 */
export interface UpdateMemoryInput {
  title?: string;
  content?: string;
  status?: MemoryStatus;
  tags?: string[];
  metadata?: Record<string, any>;
  embedding?: MemoryEmbedding;
  insight?: MemoryInsight;
  links?: Array<{
    targetMemoryId: string;
    relationship: 'related' | 'parent' | 'child' | 'reference' | 'similar';
    strength?: number;
    createdAt?: Date;
  }>;
  processedAt?: Date;
}

/**
 * Memory query filters
 */
export interface MemoryQueryFilters {
  userId?: string;
  type?: MemoryType;
  status?: MemoryStatus;
  tags?: string[];
  search?: string; // Text search in title/content
  sourceType?: string;
  sourceId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Semantic search options
 */
export interface SemanticSearchOptions {
  query: string;
  limit?: number;
  similarityThreshold?: number;
  filters?: MemoryQueryFilters;
  includeMetadata?: boolean;
}

/**
 * Hybrid search options (keyword + semantic)
 */
export interface HybridSearchOptions {
  query: string;
  limit?: number;
  similarityThreshold?: number;
  keywordWeight?: number; // 0-1, default 0.5
  semanticWeight?: number; // 0-1, default 0.5
  filters?: MemoryQueryFilters;
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
