/**
 * Memory API Slice
 * RTK Query endpoints for memory operations
 */

import { baseApi } from './baseApi';

export interface MemoryResponse {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'file' | 'note' | 'chat' | 'task' | 'event' | 'contact' | 'bookmark' | 'other';
  status: 'draft' | 'processing' | 'processed' | 'archived' | 'deleted';
  source?: {
    type: string;
    id: string;
    url?: string;
  };
  tags: string[];
  metadata: Record<string, any>;
  embedding?: {
    vectorId?: string;
    model?: string;
    dimensions?: number;
    generatedAt?: string;
  };
  insight?: {
    summary?: string;
    keyPoints?: string[];
    tags?: string[];
    category?: string;
    relatedConcepts?: string[];
    generatedAt?: string;
  };
  links: Array<{
    targetMemoryId: string;
    relationship: 'related' | 'parent' | 'child' | 'reference' | 'similar';
    strength?: number;
    createdAt?: string;
  }>;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemoryRequest {
  title: string;
  content: string;
  type: 'file' | 'note' | 'chat' | 'task' | 'event' | 'contact' | 'bookmark' | 'other';
  status?: 'draft' | 'processing' | 'processed' | 'archived' | 'deleted';
  source?: {
    type: string;
    id: string;
    url?: string;
  };
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateMemoryRequest {
  title?: string;
  content?: string;
  status?: 'draft' | 'processing' | 'processed' | 'archived' | 'deleted';
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface SearchMemoryRequest {
  query: string;
  limit?: number;
  similarityThreshold?: number;
  type?: string;
  status?: string;
  tags?: string[];
}

export interface MemoryListResponse {
  data: MemoryResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const memoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create memory
    createMemory: builder.mutation<MemoryResponse, CreateMemoryRequest>({
      query: (body) => ({
        url: '/memories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Memory'],
    }),

    // Get all memories
    getMemories: builder.query<
      MemoryListResponse,
      {
        page?: number;
        limit?: number;
        type?: string;
        status?: string;
        tags?: string;
        search?: string;
      }
    >({
      query: (params) => ({
        url: '/memories',
        params,
      }),
      providesTags: ['Memory'],
    }),

    // Get memory by ID
    getMemoryById: builder.query<MemoryResponse, string>({
      query: (id) => `/memories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Memory', id }],
    }),

    // Update memory
    updateMemory: builder.mutation<MemoryResponse, { id: string; data: UpdateMemoryRequest }>({
      query: ({ id, data }) => ({
        url: `/memories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Memory', id }, 'Memory'],
    }),

    // Delete memory
    deleteMemory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/memories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Memory'],
    }),

    // Text search
    searchMemories: builder.mutation<MemoryResponse[], SearchMemoryRequest>({
      query: (body) => ({
        url: '/memories/search',
        method: 'POST',
        body,
      }),
    }),

    // Semantic search
    semanticSearch: builder.mutation<MemoryResponse[], SearchMemoryRequest>({
      query: (body) => ({
        url: '/memories/search/semantic',
        method: 'POST',
        body,
      }),
    }),

    // Hybrid search
    hybridSearch: builder.mutation<MemoryResponse[], SearchMemoryRequest & { keywordWeight?: number; semanticWeight?: number }>({
      query: (body) => ({
        url: '/memories/search/hybrid',
        method: 'POST',
        body,
      }),
    }),

    // Get related memories
    getRelatedMemories: builder.query<MemoryResponse[], { id: string; limit?: number }>({
      query: ({ id, limit = 10 }) => `/memories/${id}/related?limit=${limit}`,
    }),

    // Get memories by tags
    getMemoriesByTags: builder.query<MemoryResponse[], { tags: string[]; limit?: number }>({
      query: ({ tags, limit = 10 }) => `/memories/tags?tags=${tags.join(',')}&limit=${limit}`,
    }),

    // Get memories by source
    getMemoriesBySource: builder.query<MemoryResponse[], { sourceType: string; sourceId: string }>({
      query: ({ sourceType, sourceId }) => `/memories/source/${sourceType}/${sourceId}`,
    }),

    // Link memories
    linkMemories: builder.mutation<
      MemoryResponse,
      { id: string; targetId: string; relationship?: 'related' | 'parent' | 'child' | 'reference' | 'similar' }
    >({
      query: ({ id, targetId, relationship = 'related' }) => ({
        url: `/memories/${id}/link/${targetId}?relationship=${relationship}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Memory', id }, 'Memory'],
    }),
  }),
});

export const {
  useCreateMemoryMutation,
  useGetMemoriesQuery,
  useGetMemoryByIdQuery,
  useUpdateMemoryMutation,
  useDeleteMemoryMutation,
  useSearchMemoriesMutation,
  useSemanticSearchMutation,
  useHybridSearchMutation,
  useGetRelatedMemoriesQuery,
  useGetMemoriesByTagsQuery,
  useGetMemoriesBySourceQuery,
  useLinkMemoriesMutation,
} = memoryApi;
