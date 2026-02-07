# Testing Strategy

## Test Types
- **Unit Tests:** Jest + @nestjs/testing for services, guards, pipes.
- **Integration Tests:** Use Nest testing module + in-memory Mongo or test containers.
- **E2E Tests:** Supertest against bootstrapped Nest app with mocked external services.
- **Contract Tests:** Ensure DTOs align with frontend expectations (planned, via Pact or schema validation).

## Setup
- pnpm --filter backend test runs unit tests.
- pnpm --filter backend test:e2e (to be configured) spins up e2e suite.
- Test database URI stored in .env.test.

## Guidelines
- Mock external providers (OpenAI, S3) using adapters.
- Keep tests deterministic; avoid reliance on real network calls.
- Use factory helpers for common fixtures located under 	est/factories.

## Coverage
- Aim for 80%+ coverage on critical modules (auth, memory, chat).
- Track coverage reports in CI; failing threshold for regressions.

## Future Enhancements
- Add worker/queue integration tests with BullMQ.
- Introduce contract tests shared with frontend via libs/shared schemas.
- Explore smoke tests post-deployment.
