# Backend Guide

Reference for developing the NestJS backend application.

## Goals
- Maintain modular boundaries with clear interfaces.
- Support background processing alongside HTTP/WebSocket APIs.
- Provide robust configuration, logging, and observability out of the box.

## Structure
- src/app.module.ts: root module wiring.
- src/modules/*: feature modules (auth, user, file, memory, etc.).
- src/common/: shared decorators, guards, interceptors.
- src/config/: configuration factories and validation.
- src/jobs/: BullMQ processors and schedulers (planned).

## Conventions
- DTOs with class-validator + class-transformer.
- Services expose domain logic; controllers stay thin.
- Use 
estjs/swagger for API documentation.
- Exception filters standardize error responses.

## Additional Docs
- [Checking Backend Status & Logs](checking-backend-status.md) ⭐ **How to verify backend is running**
- [Environment Variables](env-variables.md)
- [Database Connection Troubleshooting](database-connection-troubleshooting.md)
- [Testing Strategy](testing.md)
- [Configuration Guide](configuration.md)
- [Module Documentation](../modules/README.md)
