# Chat Module

## Purpose
Deliver a conversational interface between users and their personal AI assistant, blending memory retrieval with generative responses.

## Responsibilities
- Manage chat sessions, message history, and conversation context.
- Connect to AIEngineModule for streaming responses.
- Inject relevant memories via retrieval augmented generation (RAG).
- Provide UI-friendly streaming endpoints (WebSocket or SSE).

## Key Endpoints
- POST /chat/sessions – create session with optional context hints.
- GET /chat/sessions/:id – fetch history and metadata.
- POST /chat/sessions/:id/messages – send a new user message.
- GET /chat/sessions/:id/stream – real-time response channel.

## Data Models
- ChatSession: user, title, createdAt, assistant persona.
- ChatMessage: role, content, token usage, linked memories.
- ChatContext: cached retrieval snippets, scoring data.

## Dependencies
- Requires MemoryModule for retrieval.
- Uses AIEngineModule for completions.
- Emits session analytics to AnalyticsModule.

## Background Jobs
- Conversation summarization after N messages.
- Suggest follow-up tasks or reminders (via TaskModule).
- Periodic cleanup/archive of stale sessions.

## Security & Privacy
- Ensure cross-user isolation on session fetch.
- Allow redaction of sensitive messages.
- Support per-message encryption roadmap.

## Observability
- Metrics: active sessions, average response latency, token spend.
- Logs: structured transcripts (redacted) for debugging optional.

## TODOs / Open Questions
- Choose between SSE vs WebSocket for streaming MVP.
- Implement voice input/output for future wearable integration.
- Define assistant personas and customization API.
