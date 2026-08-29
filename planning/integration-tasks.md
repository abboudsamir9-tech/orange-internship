# Integration Tasks

> **Status:** Planning only. Not started.

See [backlog.md](backlog.md) for the full list.

## Frontend ↔ Backend
- Connect Next.js to Django REST API
- JWT authentication flow (login, token storage, Bearer header)
- Error handling and loading states (including AI generation failures and timeouts)

## End-to-End Flows
- Admin: create users, assign interns, view dashboard metrics
- Mentor: create program → set status manually → generate full roadmap → review → publish (all tasks created) → manage Kanban
- Intern: view tasks → submit work (text, multiple files, optional link) → view feedback and integer scores
- Mentor: review submissions → score (0–100 integer) → manually generate weekly report → approve
- Mentor: manually generate final summary → approve → ReportLab PDF download
- Admin: deactivate intern after program completion

## File Uploads
- Reference materials upload (multiple per program; 20 MB max per file)
- Task submission multiple file upload (allowed types per shared/enums.md) and optional external link
- ReportLab PDF download for final summary

## AI Flows

All flows: Mentor trigger → Django collects data → **Prompt Builder** → generated prompt → OpenAI (60s timeout) → validate → retry once on invalid JSON only → Draft → Mentor review.

- Roadmap: publish after approval creates all-week tasks
- Weekly report: manual trigger; approve before intern visibility
- Final summary: manual trigger; approve → ReportLab PDF
- Basic AI request logging on all flows

## Testing
- API integration tests
- End-to-end user journey tests
- AI schema validation and retry logic tests
