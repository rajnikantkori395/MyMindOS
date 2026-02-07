# Memory Module Implementation Guide

Step-by-step guide for implementing and using the Memory module.

## Implementation Status

✅ **Completed:**
- Memory schema and repository
- Memory service (CRUD, search, linking)
- Memory controller with Swagger
- DTOs and validation
- Text search support

⚠️ **Pending AI Engine Integration:**
- Semantic search (vector similarity)
- Hybrid search (keyword + semantic)
- Embedding generation
- AI-generated insights

## Architecture

```
MemoryModule
├── Enums
│   ├── MemoryType (file, note, chat, task, event, contact, bookmark, other)
│   └── MemoryStatus (draft, processing, processed, archived, deleted)
├── Constants
│   └── Chunking, search, pagination configs
├── Types
│   └── Memory types, interfaces, query filters
├── Schema
│   └── Memory schema (MongoDB with text search index)
├── Repository
│   └── MemoryRepository (database operations)
├── DTOs
│   ├── CreateMemoryDto
│   ├── UpdateMemoryDto
│   ├── SearchMemoryDto
│   └── MemoryResponseDto
├── Service
│   └── MemoryService (business logic)
└── Controller
    └── MemoryController (REST endpoints)
```

## Usage Examples

### Create Memory

```typescript
const memory = await memoryService.create(userId, {
  title: 'Important Meeting Notes',
  content: 'Discussed project timeline and deliverables...',
  type: MemoryType.NOTE,
  tags: ['work', 'meeting', 'important'],
  source: {
    type: 'note',
    id: 'note-123',
  },
});
```

### Text Search

```typescript
const results = await memoryService.textSearch(
  userId,
  'project timeline',
  10,
  {
    type: MemoryType.NOTE,
  },
);
```

### Link Memories

```typescript
await memoryService.linkMemories(
  sourceMemoryId,
  targetMemoryId,
  userId,
  'related',
  0.8, // strength
);
```

### Get Related Memories

```typescript
const related = await memoryService.getRelated(memoryId, userId, 10);
```

## MongoDB Text Search

The module uses MongoDB's text search index on `title` and `content` fields. To enable:

1. The index is automatically created by the schema
2. Search queries use `$text` operator
3. Results are sorted by relevance score

## Future: AI Engine Integration

When AI Engine module is implemented:

1. **Embedding Generation**: Automatically generate embeddings for new memories
2. **Semantic Search**: Use vector similarity for semantic search
3. **Hybrid Search**: Combine keyword and semantic search
4. **AI Insights**: Generate summaries, key points, and related concepts

## Testing

### Using Swagger UI

1. Open `http://localhost:4000/api/docs`
2. Navigate to "Memories" section
3. Try endpoints:
   - Create memory
   - List memories
   - Search memories
   - Link memories
   - Get related memories

### Using curl

```bash
# Create memory
curl -X POST http://localhost:4000/api/memories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Memory",
    "content": "This is a test memory",
    "type": "note"
  }'

# Search memories
curl -X POST http://localhost:4000/api/memories/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "test",
    "limit": 10
  }'
```

## Next Steps

- Integrate with AI Engine module for semantic search
- Add embedding generation workflow
- Implement memory processing pipeline
- Add memory insights generation
