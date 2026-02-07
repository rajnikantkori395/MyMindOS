# Backend Modules

Detailed documentation for each NestJS module powering MyMindOS. Modules follow Nest's feature-first pattern and expose contracts described below.

## Quick Links
- **[Implementation Guide](IMPLEMENTATION_GUIDE.md)** ⭐ **Start Here** - Complete guide for implementing modules
- **[API Documentation](../../api/README.md)** - Swagger UI and API reference
- **[Swagger UI](http://localhost:3000/api/docs)** - Interactive API testing (when app is running)

## Module Index
- [Auth](auth.md) ✅ **Implemented** – authentication, authorization, and session handling.
- [User](user.md) ✅ **Implemented** – profile management, preferences, personalization. [Detailed docs](user/README.md)
- [File](file.md) ✅ **Implemented** – uploads, storage, parsing, and metadata extraction. [Detailed docs](file/README.md)
- [Memory](memory.md) ✅ **Implemented** – knowledge storage, embeddings, and retrieval APIs. [Detailed docs](memory/README.md)
- [AI Engine](ai-engine.md) – LLM integrations, embedding jobs, prompt orchestration.
- [Chat](chat.md) – conversational interface, message history, streaming responses.
- [Task](task.md) – reminders, scheduled insights, agenda generation.
- [Analytics](analytics.md) – usage metrics, dashboards, and telemetry forwarding.

## Documentation Structure

Modules with detailed implementation have dedicated folders:
- `docs/modules/{module-name}/` - Detailed module documentation
  - `README.md` - Module overview and quick links
  - `implementation.md` - Step-by-step implementation guide
  - `api-reference.md` - Complete API documentation
  - `schema-dtos.md` - Database schema and DTOs
  - `testing.md` - Testing guide and examples

**Example:** [User Module Documentation](user/README.md)

## Documentation Structure

Each module doc includes:
- **Purpose & Responsibilities** - What the module does
- **Key Endpoints** - API endpoints with full paths
- **API Documentation** - Link to Swagger UI
- **Implementation Guide** - Step-by-step code examples
- **Continuous Usage Steps** - How to use and test
- **Data Models** - Database schemas
- **Dependencies** - Module relationships
- **Security & Privacy** - Security considerations
- **Observability** - Logging and metrics

## Getting Started

1. **Read Implementation Guide:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
2. **Choose a Module:** Start with Auth module (foundation)
3. **Follow Module Doc:** Use module-specific implementation guide
4. **Test in Swagger:** Use Swagger UI to test endpoints
5. **Iterate:** Add more endpoints following the same pattern
