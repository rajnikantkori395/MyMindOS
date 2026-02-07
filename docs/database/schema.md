# Database Schema

MyMindOS uses MongoDB for primary data storage and a vector database for embeddings. This document highlights key collections and relationships.

## Core Collections
- **users**: authentication identity, profile fields, plan metadata.
- **sessions**: refresh tokens, device info, expiry timestamps.
- **files**: uploaded artifacts with storage keys and extraction status.
- **memories**: normalized knowledge entries linked to files or notes.
- **memoryLinks**: associative edges for semantic/context graph.
- **chatSessions** & **chatMessages**: conversation history with AI assistant.
- **tasks**: reminders and actionable items.
- **analyticsEvents**: event telemetry for dashboards.

## Vector Store Schema
Depending on provider:
- **Qdrant/Pinecone:** collections keyed by workspace, storing embeddings with payload (memoryId, tags, timestamps).
- **MongoDB Atlas Vector:** stored alongside memory documents if using built-in vector type.

## Relationships (Conceptual)
- users 1--n files
- iles 1--n memories
- memories n--n memoryLinks
- memories 1--n chatMessages (references)
- chatSessions 1--n chatMessages
- users 1--n tasks

## Indexing Strategy
- Compound indexes on memories by userId + createdAt, 	ags, and text fields.
- TTL index on sessions.expiresAt for cleanup.
- Partial indexes for nalyticsEvents by event type/time window.

## Data Governance
- Soft deletes using deletedAt fields for recoverability.
- Field-level encryption roadmap for PII (email, phone, etc.).
- Audit logs stored separately to avoid bloating primary collections.

## Migrations
- Use Nest CLI schematics or custom scripts for schema migrations.
- Track migration history in dedicated schemaVersions collection.
- Prefer additive changes; use background migrations for heavy data transforms.

## Visualization
Future ER diagrams will live in docs/database/diagrams/*.png once generated.
