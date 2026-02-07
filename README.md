# MyMindOS – Personal AI Operating System

A unified NestJS + Next.js platform that captures, organizes, and recalls personal knowledge with LLM-powered context awareness.

## Table of Contents
- [MyMindOS – Personal AI Operating System](#mymindos--personal-ai-operating-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Getting Started](#getting-started)
    - [Monorepo Workflow Essentials](#monorepo-workflow-essentials)
  - [Project Structure](#project-structure)
  - [API Documentation](#api-documentation)
  - [Database Schema](#database-schema)
  - [State Management](#state-management)
  - [AI \& Data Pipelines](#ai--data-pipelines)
  - [Authentication Flow](#authentication-flow)
  - [Development Guidelines](#development-guidelines)
  - [Deployment](#deployment)
  - [Documentation Index](#documentation-index)
  - [Contributing](#contributing)
  - [License](#license)

## Overview
MyMindOS is a personal AI operating system that ingests notes, documents, chats, and ideas, transforming them into a structured knowledge base you can query through natural language.

## Features
- Capture: upload files, notes, links, and voice transcripts into a unified library.
- Organize: automatic tagging, metadata enrichment, and semantic linking across content.
- Recall: AI-assisted semantic search with contextual conversation history.
- Assist: daily summaries, reminders, and proactive insights driven by LLM pipelines.
- Secure: privacy-first design with data ownership controls and encryption roadmap.

## Tech Stack
- **Frontend:** Next.js, React 19, Tailwind CSS 4, Zustand/React Query (planned).
- **Backend:** NestJS, TypeScript, MongoDB via Mongoose, Redis/BullMQ (planned), LangChain.
- **AI:** OpenAI/Anthropic/Ollama via provider adapters; embeddings in Pinecone/Qdrant.
- **Infra:** Docker, pnpm workspace, Husky + lint-staged, Prometheus/Grafana, Sentry.

## Architecture
Monorepo managed by pnpm. Backend exposes modular REST/WebSocket APIs. Frontend consumes APIs and streams responses. Vector store + object storage back AI memory features.

High-level flow:
1. User captures content via UI or API.
2. Backend stores raw artifact in MongoDB/S3 and enqueues embedding jobs.
3. AI engine generates embeddings/summaries stored alongside metadata.
4. Chat assistant retrieves context from vector store and serves conversation.

Detailed diagrams live in docs/architecture/system-overview.md.

## Getting Started
1. Install prerequisites: Node 18+, pnpm via corepack, Docker Desktop.
2. Clone repository and install deps:
   ```sh
   pnpm install
   ```
3. Copy env templates and update values:
   ```sh
   copy apps\backend\.env.example apps\backend\.env
   copy apps\frontend\.env.local.example apps\frontend\.env.local
   ```
4. Run services:
   ```sh
   pnpm run dev:backend
   pnpm run dev:frontend
   ```
5. Optional: start local infra (`docker compose -f infra/docker/docker-compose.yml up`).

### Monorepo Workflow Essentials
- Workspace is managed by `pnpm-workspace.yaml`; run commands from the repo root.
- Core commands:
  ```sh
  pnpm --filter backend start:dev
  pnpm --filter frontend dev
  pnpm --filter backend test
  pnpm --filter frontend lint
  pnpm -r build
  ```
- Add shared packages under `libs/` and reference them with the workspace protocol:
  ```json
  {
    "dependencies": {
      "@mymindos/shared": "workspace:*"
    }
  }
  ```
- See [`docs/monorepo.md`](docs/monorepo.md) for deeper guidance.

## Project Structure
`
MyMindOS/
├─ apps/
│  ├─ backend/   # NestJS API gateway and modules
│  └─ frontend/  # Next.js client application
├─ libs/
│  └─ shared/    # Shared types, utilities, SDKs (WIP)
├─ docs/         # Architecture, module, and process documentation
├─ infra/        # Docker compose, IaC templates
├─ package.json  # Root workspace scripts
└─ pnpm-workspace.yaml
`

## API Documentation
- **Swagger UI:** `http://localhost:3000/api/docs` - Interactive API documentation and testing
- **OpenAPI JSON:** `http://localhost:3000/api/docs-json` - Export for Postman/Insomnia
- **Module Documentation:** See `docs/modules/` for detailed endpoint documentation
- **Implementation Guide:** See `docs/modules/IMPLEMENTATION_GUIDE.md` for step-by-step implementation

## Database Schema
MongoDB collections manage users, memories, files, and analytics. Vector store keeps embeddings for semantic search. ER diagrams in docs/database/schema.md.

## State Management
Front end will rely on React Query for server state, Zustand for UI state, with shared selectors documented in docs/frontend/state-management.md.

## AI & Data Pipelines
Embedding and retrieval workflows, job queues, and chain definitions are documented in docs/ai/pipelines.md. Provider setup guidance lives in docs/ai/providers.md.

## Authentication Flow
JWT-based auth with refresh tokens. OAuth providers planned. Flow diagram in docs/modules/auth.md.

## Development Guidelines
- Format: pnpm lint and Prettier integration via lint-staged.
- Tests: pnpm --filter backend test (Jest), frontend tests to follow.
- Commits: Conventional Commits recommended.
- Branching: feature branches merged via PR with review.

## Deployment

### Quick Deploy Options

1. **Docker Compose (Recommended for AWS EC2)**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Hybrid Free Tier (Lowest Cost)**
   - Frontend: Vercel (Free)
   - Backend: Railway/Render (Free tier)
   - Database: MongoDB Atlas (Free tier)
   - Storage: AWS S3 (Free tier)

3. **Full AWS Free Tier**
   - Frontend: AWS Amplify
   - Backend: EC2 t2.micro
   - Database: MongoDB Atlas
   - Storage: S3

### Detailed Deployment Guide

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete step-by-step instructions including:
- AWS EC2 setup
- Docker deployment
- Environment configuration
- CI/CD setup
- Monitoring and troubleshooting

### Deployment Scripts

- **Windows**: `.\scripts\deploy.ps1`
- **Linux/Mac**: `./scripts/deploy.sh`

### Local Development
- Docker Compose for MongoDB, Redis, Qdrant, MinIO: `docker-compose -f infra/docker/docker-compose.yml up -d`

## Documentation Index
See [docs/README.md](docs/README.md) for deep dives on modules, architecture, AI, and frontend patterns.

## Contributing
1. Fork or branch from main.
2. Write tests and docs for new features.
3. Run lint and tests before PR.
4. Submit PR referencing issues; reviewers ensure quality.

## License
MIT License © MyMindOS contributors.
