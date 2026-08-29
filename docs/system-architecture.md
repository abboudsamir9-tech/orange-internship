# System Architecture

> **Status:** Future high-level architecture only. Not implemented.

## Overview

```
┌─────────────┐     HTTP/REST      ┌─────────────┐
│   Next.js   │ ────────────────▶ │   Django    │
│  (Frontend) │ ◀──────────────── │  REST API   │
└─────────────┘                   └──────┬──────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
             ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
             │ PostgreSQL  │     │ OpenAI API  │     │ Local Media │
             │  (Database) │     │  (via SDK)  │     │   Storage   │
             └─────────────┘     └─────────────┘     └─────────────┘
```

## Components

### Next.js (Frontend)

- Role-based dashboards for Admin, Mentor, and Intern
- Communicates with Django REST API only
- Authenticates using **JWT** (Bearer token in API requests)
- Never calls OpenAI directly
- Uses `NEXT_PUBLIC_API_BASE_URL` for API base URL

### Django REST API (Backend)

- Handles **JWT** authentication, authorization, and business logic
- Collects data for AI features
- **Stage 1:** AI Prompt Builder assembles optimized prompts from structured context
- **Stage 2:** Calls OpenAI LLM API with generated prompt via generators
- Validates LLM JSON responses against output schemas
- Stores drafts until Mentor approval
- Serves file uploads and generated PDFs from local media storage

### PostgreSQL (Database)

- Persistent storage for users, programs, tasks, submissions, reports, and summaries

### OpenAI API

- Called exclusively from Django backend
- API key stored in `OPENAI_API_KEY` environment variable
- Request timeout: **60 seconds**
- Returns structured JSON for roadmaps, weekly reports, and final summaries

### Local Media Storage

- Reference materials, task submission files, and generated PDFs stored locally during MVP
- Structure should allow cloud storage migration later (not implemented)

## Design Principles

- Monolithic Django backend (no microservices)
- No message queues, caching layers, or background workers in MVP
- AI requests processed synchronously through Django (implementation detail for later)
- All AI content requires human (Mentor) approval before becoming active

## Not Included in MVP Architecture

- Docker / container orchestration
- CI/CD pipelines
- Redis, Celery, or task queues
- Cloud storage (S3, etc.)
- CDN
- Separate AI microservice
