/**
 * File API Slice
 * RTK Query endpoints for file operations
 */

import { baseApi } from './baseApi';

export interface FileResponse {
  id: string;
  userId: string;
  filename: string;
  mimeType: string;
  size: number;
  checksum?: string;
  storageKey: string;
  storageProvider: 's3' | 'minio' | 'local';
  url?: string;
  thumbnailUrl?: string;
  type: 'document' | 'image' | 'audio' | 'video' | 'archive' | 'other';
  status: 'uploading' | 'uploaded' | 'processing' | 'processed' | 'failed' | 'deleted';
  metadata: Record<string, any>;
  extractionResult?: {
    text?: string;
    metadata?: Record<string, any>;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error?: string;
    processedAt?: Date;
  };
  processedAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface PresignedUrlRequest {
  filename: string;
  mimeType: string;
  size: string;
  type?: 'document' | 'image' | 'audio' | 'video' | 'archive' | 'other';
  expiresIn?: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileId?: string;
  expiresIn: number;
}

export interface FileListResponse {
  data: FileResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StorageUsageResponse {
  totalBytes: number;
  totalFiles: number;
  limitBytes: number;
}

export interface DownloadUrlResponse {
  url: string;
  expiresIn: number;
}

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Generate presigned URL for upload
    generatePresignedUrl: builder.mutation<PresignedUrlResponse, PresignedUrlRequest>({
      query: (body) => ({
        url: '/files/presigned-url',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['File'],
    }),

    // Upload file directly
    uploadFile: builder.mutation<FileResponse, FormData>({
      query: (formData) => ({
        url: '/files/upload',
        method: 'POST',
        body: formData,
        formData: true, // This tells RTK Query not to set Content-Type
      }),
      invalidatesTags: ['File'],
    }),

    // Mark file upload as complete
    markUploadComplete: builder.mutation<FileResponse, string>({
      query: (fileId) => ({
        url: `/files/${fileId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['File'],
    }),

    // Get all files
    getFiles: builder.query<
      FileListResponse,
      {
        page?: number;
        limit?: number;
        type?: string;
        status?: string;
        search?: string;
      }
    >({
      query: (params) => ({
        url: '/files',
        params,
      }),
      providesTags: ['File'],
    }),

    // Get file by ID
    getFileById: builder.query<FileResponse, string>({
      query: (id) => `/files/${id}`,
      providesTags: (result, error, id) => [{ type: 'File', id }],
    }),

    // Get download URL
    getDownloadUrl: builder.query<DownloadUrlResponse, string>({
      query: (id) => `/files/${id}/download`,
    }),

    // Get storage usage
    getStorageUsage: builder.query<StorageUsageResponse, void>({
      query: () => '/files/storage/usage',
      providesTags: ['File'],
    }),

    // Delete file
    deleteFile: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['File'],
    }),
  }),
});

export const {
  useGeneratePresignedUrlMutation,
  useUploadFileMutation,
  useMarkUploadCompleteMutation,
  useGetFilesQuery,
  useGetFileByIdQuery,
  useGetDownloadUrlQuery,
  useGetStorageUsageQuery,
  useDeleteFileMutation,
} = fileApi;
