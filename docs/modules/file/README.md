# File Module

Complete file upload, storage, and management functionality for MyMindOS.

## Overview

The File module handles:
- File uploads (direct and presigned URLs)
- File storage in S3/MinIO
- File metadata management
- Download URL generation
- Storage quota management

## Quick Links

- **[Implementation Guide](../IMPLEMENTATION_GUIDE.md)** - General implementation patterns
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Schema & DTOs](schema-dtos.md)** - Database schemas and DTOs reference
- **[Testing Guide](testing.md)** - Testing examples and strategies

## Features

✅ **File Upload**
- Direct multipart/form-data upload
- Presigned URL for client-side upload
- Automatic file type detection
- MIME type validation
- File size limits

✅ **Storage Management**
- S3/MinIO integration
- Automatic storage key generation
- Checksum calculation
- Soft delete with retention

✅ **File Management**
- List files with pagination
- Filter by type, status, search
- Get file metadata
- Generate download URLs
- Storage usage tracking

## API Endpoints

### Upload Files
- `POST /api/files/upload` - Direct file upload
- `POST /api/files/presigned-url` - Generate presigned upload URL
- `POST /api/files/:id/complete` - Mark presigned upload as complete

### Retrieve Files
- `GET /api/files` - List all files (paginated)
- `GET /api/files/:id` - Get file by ID
- `GET /api/files/:id/download` - Get download URL
- `GET /api/files/storage/usage` - Get storage usage

### Delete Files
- `DELETE /api/files/:id` - Delete file

## Getting Started

### 1. Configure Storage

Add to `apps/backend/.env`:

```env
STORAGE_PROVIDER=minio
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=mymindos
S3_ACCESS_KEY=localaccess
S3_SECRET_KEY=localsecret
S3_REGION=us-east-1
```

### 2. Start MinIO (if using local)

```bash
docker-compose -f infra/docker/docker-compose.yml up -d minio
```

### 3. Test Upload

Use Swagger UI at `http://localhost:4000/api/docs` to test file uploads.

## File Types Supported

- **Documents**: PDF, Word, Excel, PowerPoint, Text, Markdown, CSV
- **Images**: JPEG, PNG, GIF, WebP, SVG
- **Audio**: MP3, WAV, OGG, WebM
- **Video**: MP4, WebM, OGG
- **Archives**: ZIP, TAR, GZIP

## Storage Limits

- **Max File Size**: 100 MB (configurable)
- **Max Image Size**: 10 MB
- **Max Document Size**: 50 MB
- **Max Audio Size**: 100 MB
- **Max Video Size**: 500 MB

## Security

- File type validation (MIME type whitelist)
- File size limits
- User-based access control
- Presigned URLs with expiration
- Soft delete with retention policy

## Next Steps

- See [API Reference](api-reference.md) for detailed endpoint documentation
- See [Testing Guide](testing.md) for testing examples
- See [Schema & DTOs](schema-dtos.md) for data models
