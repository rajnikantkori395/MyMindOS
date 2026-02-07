# Memory Module

## Purpose
Serve as the core knowledge repository: storing normalized content, embeddings, and metadata for semantic retrieval.

## Responsibilities
- Persist structured memories derived from uploaded files, notes, and chats.
- Manage chunking, tagging, and concept relationships.
- Expose search APIs combining metadata filters and vector similarity.

## Key Endpoints
- POST /memories – create/update memory records (primarily internal).
- GET /memories – paginated search with filters.
- GET /memories/:id – rich detail view with linked artifacts.
- POST /memories/search – hybrid keyword + semantic query endpoint.

## Data Models
- Memory: reference to source, content, embedding vector ID, tags.
- MemoryLink: edges connecting related memories (context graph).
- MemoryInsight: AI-generated summaries, takeaways, highlights.

## Dependencies
- Relies on AIEngineModule for embedding generation and summarization.
- Integrates with vector store (Pinecone/Qdrant/MongoDB Atlas).
- Emits events to AnalyticsModule for usage metrics.

## Background Jobs
- Ingestion pipeline (chunking + embeddings) triggered via queue.
- Scheduled re-embedding when prompts/models change.
- Graph building tasks to identify related concepts.

## Security & Privacy
- Enforce per-user or workspace isolation; no cross-tenant leakage.
- Sensitive memory fields encrypted or redacted when exporting.
- Audit trail for AI access of private memories.

## Observability
- Metrics: ingestion latency, search response times, retrieval quality.
- Logging: query traces with anonymized payloads for debugging.

## TODOs / Open Questions
- Define scoring strategy for hybrid search.
- Evaluate cost/performance of chosen vector DB.
- Plan for offline/edge storage in premium tiers.
