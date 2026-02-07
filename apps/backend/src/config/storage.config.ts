/**
 * Storage Configuration
 * S3/MinIO configuration for file storage
 */

export default () => ({
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'minio',
    s3: {
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      bucket: process.env.S3_BUCKET || 'mymindos',
      accessKey: process.env.S3_ACCESS_KEY || 'localaccess',
      secretKey: process.env.S3_SECRET_KEY || 'localsecret',
      region: process.env.S3_REGION || 'us-east-1',
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false', // Required for MinIO
    },
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100 MB default
    presignedUrlExpiration: parseInt(
      process.env.PRESIGNED_URL_EXPIRATION || '3600',
      10,
    ), // 1 hour default
  },
});
