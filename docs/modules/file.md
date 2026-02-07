# File Module

## Purpose
Ingest user-uploaded artifacts (documents, images, audio) and prepare them for downstream memory processing.

## Responsibilities
- Accept uploads via REST and presigned URLs.
- Persist metadata in MongoDB and binary data in object storage (S3/MinIO).
- Trigger parsing/extraction workflows (text, OCR, transcription).
- Manage quotas and file versioning.

## Key Endpoints
- POST /files – direct upload or presigned handshake.
- GET /files/:id – metadata retrieval and download link.
- DELETE /files/:id – soft delete with retention policy.
- POST /files/:id/reprocess – re-run parsers with updated pipelines.

## Data Models
- FileRecord: filename, mime type, size, checksum, storage key.
- ExtractionResult: structured content, status, error logs.
- QuotaUsage: aggregated per-user storage consumption.

## Dependencies
- Uses MemoryModule to link extracted content to memories.
- Relies on TaskModule/queue workers for async extraction.
- Configured via ConfigModule for storage credentials.

## Background Jobs
- OCR/transcription tasks (BullMQ workers).
- Virus scanning hooks prior to marking upload complete.
- Retention sweep for expired soft-deleted files.

## Security & Privacy
- Client-side encryption support planned for premium tiers.
- Signed URLs with short-lived tokens for download.
- Antivirus scanning before ingestion, file type allowlist.

## Observability
- Metrics: upload success/failure, average processing time.
- Structured logs for extraction errors and parser outputs.

## TODOs / Open Questions
- Define maximum file size per plan.
- Select default transcription/OCR providers.
- Explore differential sync for external data sources (Google Drive, etc.).
