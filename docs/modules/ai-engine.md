# AI Engine Module

## Purpose
Abstract access to language models, embedding services, and prompt workflows. Centralizes AI provider configuration.

## Responsibilities
- Provide unified client for OpenAI, Anthropic, and local models (Ollama).
- Manage prompt templates, system messages, and output parsing.
- Expose services for embedding, summarization, classification, and generation.
- Handle rate limiting, retries, and cost tracking per workspace.

## Key Services
- EmbeddingService.generateForText(chunks)
- SummarizationService.createDigest(memoryId)
- ChatCompletionService.streamConversation(session, input)
- ToolRegistry for function-calling and structured outputs.

## Dependencies
- Consumes configuration/env secrets from ConfigModule.
- Enqueues long-running tasks through TaskModule + Redis.
- Publishes usage events to AnalyticsModule.

## Background Jobs
- Batch embedding workers.
- Nightly model evaluation and drift detection tasks.
- Cache warmers for frequently used prompts.

## Security & Privacy
- Redact PII before sending to third-party APIs when necessary.
- Support customer-provided API keys and usage isolation.
- Maintain provider audit logs and token usage receipts.

## Observability
- Metrics: token usage, latency per provider, error counts.
- Structured logging around prompts (with redaction).

## TODOs / Open Questions
- Evaluate fine-tuning vs. prompt engineering for personalization.
- Determine fallback strategy when providers are rate limited.
- Define governance for adding new AI tools.
