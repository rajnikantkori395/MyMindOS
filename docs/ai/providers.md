# AI Providers

## Supported Providers
- **OpenAI:** GPT-4.1, GPT-4o mini for chat; 	ext-embedding-3 series for embeddings.
- **Anthropic:** Claude 3 models for long-context reasoning (enterprise tier).
- **Ollama/Local:** Open-source LLMs (Llama, Mistral) for offline/private deployments.

## Configuration
- API keys stored in environment variables (OPENAI_API_KEY, ANTHROPIC_API_KEY).
- Provider-specific settings defined in pps/backend/src/config/ai.config.ts (planned).
- Each workspace may supply custom keys; stored encrypted at rest.

## Selection Strategy
- Default to OpenAI for balanced performance/cost.
- Allow workspace-level override (e.g., enterprise chooses Anthropic).
- Auto fallback to secondary provider if primary hits rate limits.

## Embedding Strategy
- Use single embedding provider per workspace to ensure consistent vector space.
- Support periodic re-embedding when switching providers or models.

## Cost & Usage Tracking
- AI engine records token usage per request.
- Analytics module aggregates spend per workspace for billing.
- Budget enforcement via throttling or plan upgrades.

## Compliance & Data Handling
- Option to redact sensitive fields before external API calls.
- Provide on-prem/local inference via Ollama for maximum privacy.
- Document data retention policies for each provider.

## Future Work
- Add Azure OpenAI/GCP Vertex AI adapters.
- Support model evaluation/benchmarking pipeline to recommend defaults.
- Implement adaptive model selection based on task complexity.
