# Configuration Guide

## Environment Files
- pps/backend/.env for local development.
- Create .env.example with documented variables; commit to repo.
- Use dotenv-safe or validation via @nestjs/config.

## Core Variables
- PORT: HTTP port.
- MONGO_URI: MongoDB connection string.
- REDIS_URL: Redis instance for queues.
- VECTOR_DB_URL / VECTOR_DB_API_KEY: Qdrant/Pinecone connection.
- S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET.
- JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_TTL, JWT_REFRESH_TTL.
- OPENAI_API_KEY, ANTHROPIC_API_KEY, OLLAMA_BASE_URL.

## Configuration Modules
- config/app.config.ts: global app settings.
- config/database.config.ts: Mongo and Redis.
- config/storage.config.ts: object storage.
- config/ai.config.ts: AI provider keys and defaults.
- config/security.config.ts: password hashing, rate limits.

## Validation
Use egisterAs + Joi or class-validator schemas to ensure env variables exist and meet criteria.

## Secrets Management
- Local: .env (excluded from VCS).
- Staging/Prod: AWS Secrets Manager or Parameter Store, injected at runtime.
- Rotate keys regularly; document rotation process.

## Feature Flags
- Consider LaunchDarkly or simple config-driven flags stored in Mongo for enabling new modules.

## Future Work
- Build config loader for multi-tenant overrides.
- Add CLI command to verify configuration before boot.
