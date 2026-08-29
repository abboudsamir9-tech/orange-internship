# AI-Powered Internship Management Platform

A platform for managing internship programs with AI-assisted roadmap generation, task tracking, weekly performance reports, and final internship summaries.

## Approved MVP Scope

The MVP supports Admin, Mentor, and Intern roles with:

- Internship program creation and management
- Intern profiles, skills, and preferences
- AI roadmap generation with mentor review and approval
- Kanban task board with submissions and mentor feedback
- AI weekly performance reports
- Final internship summaries with PDF download
- Role-based dashboards

See [docs/mvp-scope.md](docs/mvp-scope.md) for included and excluded features.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js |
| Backend | Python Django + Django REST Framework (later) |
| Database | PostgreSQL |
| AI | OpenAI API (via Django backend only) |
| File Storage | Local media during MVP development |

## Repository Structure

```
├── README.md
├── docs/              # System documentation
├── frontend/          # Next.js app (not implemented)
├── backend/           # Django project (not implemented)
├── ai/                # Two-stage AI: prompt_builder, generators, validators, schemas
├── shared/            # Enums, contracts, validation rules
├── planning/          # Implementation backlog and task lists
├── .env.example       # Environment variable placeholders
└── .gitignore
```

## Current Project Status

**Frontend MVP UI in progress (mock data)**

The Next.js frontend has been initialized with Tailwind CSS and role-based screens using mock data only. Backend, database, JWT authentication, and AI integrations are not implemented yet.

## Future Implementation Order

See [docs/implementation-order.md](docs/implementation-order.md) for the recommended sequence:

1. Backend foundation
2. User and role system
3. Programs and intern profiles
4. Roadmaps
5. Tasks and assignments
6. Submissions and reviews
7. Weekly reports
8. Final summaries and PDFs
9. Frontend integration
10. AI integration
11. Testing and deployment

## How to Use This Documentation

1. Start with [docs/system-overview.md](docs/system-overview.md) for business context.
2. Read [docs/mvp-scope.md](docs/mvp-scope.md) to understand what is in and out of scope.
3. Review [docs/roles-and-permissions.md](docs/roles-and-permissions.md) for access control rules.
4. Follow [docs/user-journey.md](docs/user-journey.md) for the end-to-end flow.
5. Use [docs/database-design.md](docs/database-design.md) and [shared/](shared/) when implementing data models and APIs.
6. Refer to [docs/ai-features.md](docs/ai-features.md) and [ai/](ai/) for the two-stage AI architecture (Prompt Builder → LLM → Validation → Draft).
7. All MVP decisions are documented; see [docs/open-questions.md](docs/open-questions.md) for the full resolved decision log.
