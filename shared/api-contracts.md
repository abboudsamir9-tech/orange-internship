# API Contracts

> **Status:** High-level contract placeholders only. Endpoints not implemented.

Future REST API contracts between Next.js frontend and Django backend. Detailed endpoint definitions will be added during implementation.

## Authentication

Use **JWT (JSON Web Tokens)**.

- Login returns access token (and refresh token if implemented during backend foundation).
- Frontend includes `Authorization: Bearer <token>` on API requests.
- Backend validates JWT and enforces role-based access.
- Not implemented yet.

## General Conventions

- Base URL: `NEXT_PUBLIC_API_BASE_URL`
- JSON request/response bodies
- Role-based access enforced on backend
- Task scores: integers 0–100 only

## Resource Groups (Future)

### Accounts
- User CRUD (Admin)
- Mentor/Intern account creation (Admin)
- Assign intern to mentor (Admin)
- Deactivate/reactivate accounts (Admin)

### Programs
- Program CRUD (Mentor create/manage; Admin read-only content)
- Manual program status updates (Mentor)
- Intern profile management
- Reference materials CRUD (multiple per program)

### Roadmaps
- Generate roadmap (Mentor → triggers AI via backend; full multi-week output)
- CRUD draft roadmap (Mentor)
- Publish roadmap (Mentor → creates all Task records for all weeks)

### Tasks
- Task CRUD (Mentor)
- Task assignment to interns (Mentor; separate TaskAssignment per intern)
- Task assignment status update (Intern)
- Deadline management (Mentor)

### Submissions
- Create submission with text, multiple files, optional external link (Intern)
- List submissions for assignment (Mentor, Intern)
- Review: feedback and integer score 0–100 (Mentor)

### Reports
- Generate weekly report manually (Mentor → triggers AI)
- CRUD/approve weekly report (Mentor)
- View approved weekly report (Intern)

### Final Summaries
- Generate final summary manually (Mentor → triggers AI)
- CRUD/approve final summary (Mentor)
- Download PDF — ReportLab-generated (Mentor, Intern where allowed)

### Dashboards
- Admin overview metrics and chart data
- Mentor dashboard metrics and chart data
- Intern dashboard metrics and chart data

### Admin Monitoring
- Overview endpoints for mentors, interns, programs, activity

## AI Endpoints (Future)

All AI endpoints follow the two-stage flow: **Prompt Builder → LLM → Validation → Draft**.

- Called by Mentor only (except viewing approved content)
- Processed by Django backend via `ai/prompt_builder/` and `ai/generators/`
- Static templates in `ai/prompts/` are not sent directly to the LLM
- Return draft content for mentor review
- On invalid JSON: retry generation once; second failure returns error, no invalid data saved
- On timeout (60 seconds): cancel, mark failed, notify Mentor, manual retry only
- Basic request logging (feature type, timestamp, status, error message)

## Not Implemented

No endpoint paths, HTTP methods, or request/response schemas are defined yet. Refer to [../docs/ai-integration-flow.md](../docs/ai-integration-flow.md) and [../ai/schemas/](../ai/schemas/) when implementing.
