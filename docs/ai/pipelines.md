# AI Pipelines

## Overview
MyMindOS uses retrieval-augmented generation (RAG) pipelines to convert unstructured data into actionable insights and conversational responses.

## Ingestion Pipeline
1. **Trigger:** File upload, note creation, or external data sync.
2. **Parsing:** Extract text/audio using adapters (PDF, DOCX, audio transcription).
3. **Chunking:** Split content into overlapping segments configurable per content type.
4. **Embedding:** Call AIEngineModule to generate vector representations.
5. **Persistence:** Store chunk metadata + embedding IDs in MemoryModule and vector DB.
6. **Post-processing:** Summaries, keywords, entity extraction saved as memory insights.

## Retrieval Pipeline
1. Receive query from chat or search endpoint.
2. Generate embedding for query.
3. Retrieve top-K relevant memories from vector DB.
4. Re-rank using metadata filters and recency.
5. Build context window for LLM with guardrails (token budgeting).
6. Call ChatCompletionService with context; stream response to client.

## Summarization Pipeline
- Scheduled digests iterating over new/updated memories.
- Multi-step summarization (map-reduce) for large documents.
- Output stored in MemoryInsight and used in daily recap emails.

## Task Extraction Pipeline (planned)
- Run classification model on chat responses/memories to detect actionable items.
- Create tasks with due dates and link to origin content.

## Observability & Quality
- Track embedding latency, retrieval hit rate, hallucination reports.
- Store feedback signals (thumbs up/down) to improve prompts and ranking.
- Implement evaluation harness with golden datasets.

## Future Enhancements
- Adaptive chunk sizing based on content type.
- Multi-vector retrieval (semantic + keyword + structural).
- Fine-tuned models for personalized tone and summarization.
