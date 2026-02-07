# File Module Implementation Guide

Step-by-step guide for implementing and using the File module.

## Implementation Status

✅ **Completed:**
- File schema and repository
- Storage service (S3/MinIO)
- File service (upload, download, management)
- File controller with Swagger
- DTOs and validation
- Storage configuration

## Architecture

```
FileModule
├── Enums
│   ├── FileStatus (uploading, uploaded, processing, processed, failed, deleted)
│   └── FileType (document, image, audio, video, archive, other)
├── Constants
│   └── File size limits, MIME types, pagination
├── Types
│   └── File types, interfaces, query filters
├── Schema
│   └── File schema (MongoDB)
├── Repository
│   └── FileRepository (database operations)
├── Services
│   ├── FileService (business logic)
│   └── StorageService (S3/MinIO operations)
├── DTOs
│   ├── UploadFileDto
│   ├── PresignedUrlDto
│   └── FileResponseDto
└── Controller
    └── FileController (REST endpoints)
```

## Setup

### 1. Environment Configuration

Add to `apps/backend/.env`:

```env
# Storage Configuration
STORAGE_PROVIDER=minio
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=mymindos
S3_ACCESS_KEY=localaccess
S3_SECRET_KEY=localsecret
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
MAX_FILE_SIZE=104857600
PRESIGNED_URL_EXPIRATION=3600
```

### 2. Start MinIO

```bash
docker-compose -f infra/docker/docker-compose.yml up -d minio
```

Access MinIO Console: `http://localhost:9001`
- Username: `localaccess`
- Password: `localsecret`

### 3. Create Bucket

The bucket will be created automatically on first upload, or create it manually in MinIO console.

## Usage Examples

### Direct Upload

```typescript
// Using fetch
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:4000/api/files/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  body: formData,
});

const file = await response.json();
```

### Presigned URL Upload

```typescript
// Step 1: Get presigned URL
const response = await fetch('http://localhost:4000/api/files/presigned-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    filename: 'document.pdf',
    mimeType: 'application/pdf',
    size: '1024000',
  }),
});

const { uploadUrl, fileId } = await response.json();

// Step 2: Upload directly to S3/MinIO
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'application/pdf',
  },
});

// Step 3: Mark as complete
await fetch(`http://localhost:4000/api/files/${fileId}/complete`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
```

### List Files

```typescript
const response = await fetch('http://localhost:4000/api/files?page=1&limit=20', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const { data, total, page, limit } = await response.json();
```

### Download File

```typescript
const response = await fetch(`http://localhost:4000/api/files/${fileId}/download`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const { url } = await response.json();
// Use URL to download file
```

## File Processing

Files are stored with status `UPLOADED` initially. Processing can be triggered later by:
- Memory module (for text extraction)
- AI Engine module (for embeddings)
- Task module (for scheduled processing)

## Storage Quotas

Check storage usage:

```typescript
const response = await fetch('http://localhost:4000/api/files/storage/usage', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const { totalBytes, totalFiles, limitBytes } = await response.json();
```

## Error Handling

Common errors:
- `400 Bad Request`: Invalid file type, size exceeded, validation error
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not authorized to access file
- `404 Not Found`: File doesn't exist
- `500 Internal Server Error`: Storage error, database error

## Testing

### Using Swagger UI

1. Open `http://localhost:4000/api/docs`
2. Navigate to "Files" section
3. Try endpoints:
   - Generate presigned URL
   - Upload file
   - List files
   - Get file by ID
   - Delete file

### Using curl

```bash
# Upload file
curl -X POST http://localhost:4000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"

# List files
curl http://localhost:4000/api/files \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get file
curl http://localhost:4000/api/files/FILE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

- Integrate with Memory module for content extraction
- Add file processing workflows
- Implement file versioning
- Add thumbnail generation for images
