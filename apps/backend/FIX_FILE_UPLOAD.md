# Fix File Upload Issues

## Issues Fixed

### 1. CORS Configuration
- Added additional headers for file uploads: `Content-Length`, `X-File-Name`
- Added `exposedHeaders` for CORS
- Added `maxAge` for preflight caching

### 2. ValidationPipe Configuration
- Changed `forbidNonWhitelisted` to `false` to allow file uploads
- Added `transformOptions` for better type conversion

### 3. File Controller
- Added proper exception handling (`BadRequestException`, `UnauthorizedException`)
- Added better logging for file uploads

### 4. Frontend API
- RTK Query automatically handles FormData - no need to set Content-Type manually
- Browser will set `multipart/form-data` with boundary automatically

## Testing

### Using Swagger UI
1. Start backend: `pnpm run dev:backend`
2. Open Swagger: `http://localhost:4000/api/docs`
3. Navigate to Files → POST /api/files/upload
4. Click "Try it out"
5. Upload a file using the file picker
6. Click "Execute"

### Using Frontend
1. Start frontend: `pnpm run dev:frontend`
2. Navigate to `http://localhost:3000/files`
3. Select a file and click "Upload File"

### Using curl
```bash
curl -X POST http://localhost:4000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@path/to/file.pdf" \
  -F "type=document"
```

## Common Issues

### Issue: "Failed to fetch" or CORS error
**Solution**: 
- Check backend is running on port 4000
- Check frontend origin is in allowedOrigins (localhost:3000, localhost:3001, etc.)
- Check backend logs for CORS blocked origin messages

### Issue: "No file provided"
**Solution**:
- Ensure file input is properly bound
- Check FormData is being created correctly
- Verify file is selected before upload

### Issue: "Validation failed"
**Solution**:
- ValidationPipe now allows file uploads
- If still failing, check file size limits (100MB default)

## Environment Variables

Make sure these are set in `apps/backend/.env`:
```env
STORAGE_PROVIDER=minio
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=mymindos
S3_ACCESS_KEY=localaccess
S3_SECRET_KEY=localsecret
S3_REGION=us-east-1
```

## Next Steps

1. Start MinIO if using local storage:
   ```bash
   docker-compose -f infra/docker/docker-compose.yml up -d minio
   ```

2. Restart backend to apply changes:
   ```bash
   pnpm run dev:backend
   ```

3. Test file upload from frontend or Swagger UI
