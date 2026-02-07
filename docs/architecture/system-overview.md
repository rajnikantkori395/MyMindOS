# System Overview

MyMindOS follows a modular monolithic architecture with clear boundaries between functional domains. The stack is designed for future evolution into microservices without premature complexity.

## High-Level Components
- **Next.js Frontend:** React-based dashboard with Tailwind styling and client-side state via React Query/Zustand.
- **NestJS Backend:** Modular API handling auth, file ingestion, memory management, AI orchestration, and analytics.
- **MongoDB:** Primary document store for users, memories, and analytics.
- **Vector Database:** Qdrant/Pinecone/MongoDB Vector for semantic embeddings.
- **Object Storage:** AWS S3 (prod) or MinIO (dev) for file blobs.
- **Redis + BullMQ:** Background job handling for embeddings and notifications.
- **AI Providers:** OpenAI/Anthropic/Ollama integrated through a common service interface.

## Data Flow
1. User submits content via frontend.
2. Backend stores raw data, emits job for parsing/embedding.
3. AI engine processes content, storing embeddings in vector DB.
4. Chat assistant fetches relevant memories, streams response back to client.

`mermaid
graph TD
  A[Frontend] -->|REST/WebSocket| B[NestJS API]
  B --> C[Auth Module]
  B --> D[File Module]
  B --> E[Memory Module]
  B --> F[AI Engine Module]
  B --> G[Chat Module]
  B --> H[Task Module]
  B --> I[Analytics Module]
  D --> J[(Object Storage)]
  E --> K[(MongoDB)]
  F --> L[(Vector DB)]
  G --> F
  F --> E
  H --> K
  I --> K
`

## Module Boundaries
See docs/modules/README.md for detailed contracts and dependencies among modules.

## Scaling Considerations
- Horizontal scaling via container replicas for API and worker roles.
- Redis queues to decouple heavy AI processing.
- Potential split into microservices once load and team size necessitate.

## Observability
- Centralized logging (JSON), metrics export via Prometheus, tracing with OpenTelemetry (future).
- Sentry for frontend/backend error reporting.

## Security Principles
- Principle of least privilege (per-user data partitioning).
- Encryption in transit everywhere; encryption at rest for sensitive fields planned.
- Comprehensive audit logging for admin actions and AI data usage.
