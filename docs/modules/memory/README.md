# Memory Module

Complete knowledge storage and retrieval functionality for MyMindOS.

## Overview

The Memory module handles:
- Memory creation and management
- Text search in memories
- Semantic/vector search (with AI Engine integration)
- Memory linking and relationships
- Tag-based organization

## Quick Links

- **[Implementation Guide](../IMPLEMENTATION_GUIDE.md)** - General implementation patterns
- **[API Reference](api-reference.md)** - Complete API documentation
- **[Schema & DTOs](schema-dtos.md)** - Database schemas and DTOs reference
- **[Testing Guide](testing.md)** - Testing examples and strategies

## Features

✅ **Memory Management**
- Create, read, update, delete memories
- Support for multiple memory types (file, note, chat, task, event, contact, bookmark)
- Status tracking (draft, processing, processed, archived, deleted)
- Source linking (link memories to files, notes, etc.)

✅ **Search Capabilities**
- Text search (MongoDB full-text search)
- Semantic search (vector similarity - requires AI Engine)
- Hybrid search (keyword + semantic - requires AI Engine)
- Tag-based filtering
- Type and status filtering

✅ **Memory Relationships**
- Link related memories
- Track relationship types (related, parent, child, reference, similar)
- Get related memories

## API Endpoints

### Memory Management
- `POST /api/memories` - Create memory
- `GET /api/memories` - List all memories (paginated, filtered)
- `GET /api/memories/:id` - Get memory by ID
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory

### Search
- `POST /api/memories/search` - Text search
- `POST /api/memories/search/semantic` - Semantic search (requires AI Engine)
- `POST /api/memories/search/hybrid` - Hybrid search (requires AI Engine)

### Relationships
- `GET /api/memories/:id/related` - Get related memories
- `POST /api/memories/:id/link/:targetId` - Link two memories

### Filtering
- `GET /api/memories/tags` - Get memories by tags
- `GET /api/memories/source/:sourceType/:sourceId` - Get memories by source

## Memory Types

- **FILE** - Extracted from uploaded files
- **NOTE** - User-created notes
- **CHAT** - From chat conversations
- **TASK** - Task-related memories
- **EVENT** - Event-related memories
- **CONTACT** - Contact information
- **BOOKMARK** - Bookmarked content
- **OTHER** - Other types

## Memory Status

- **DRAFT** - Initial state
- **PROCESSING** - Being processed (embedding generation, etc.)
- **PROCESSED** - Ready for use
- **ARCHIVED** - Archived but not deleted
- **DELETED** - Soft deleted

## Getting Started

### 1. Create a Memory

```typescript
const response = await fetch('http://localhost:4000/api/memories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    title: 'Important Meeting Notes',
    content: 'Discussed project timeline and deliverables...',
    type: 'note',
    tags: ['work', 'meeting', 'important'],
  }),
});
```

### 2. Search Memories

```typescript
const response = await fetch('http://localhost:4000/api/memories/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    query: 'project timeline',
    limit: 10,
  }),
});
```

### 3. Link Memories

```typescript
const response = await fetch(
  `http://localhost:4000/api/memories/${memoryId}/link/${targetId}?relationship=related`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  },
);
```

## Integration with Other Modules

- **File Module**: Memories can be created from uploaded files
- **AI Engine Module**: Required for semantic search and embeddings
- **Chat Module**: Memories can be created from chat conversations
- **Task Module**: Task-related memories

## Next Steps

- See [API Reference](api-reference.md) for detailed endpoint documentation
- See [Testing Guide](testing.md) for testing examples
- See [Schema & DTOs](schema-dtos.md) for data models
- Integrate with AI Engine module for semantic search
