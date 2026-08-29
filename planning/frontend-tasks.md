# Frontend Tasks

> **Status:** Planning only. Not started.

See [backlog.md](backlog.md) for the full list. Grouped for implementation reference.

## Setup
- Set up Next.js project
- Configure API client with base URL and JWT interceptors
- Define TypeScript types from shared contracts (including skill levels 1–5)

## Layout and Navigation
- Role-based navigation and route protection
- Shared layout components (modern dashboard style)

## Admin
- Admin dashboard with summary cards and charts (see docs/mvp-scope.md)
- User management views (create Mentor/Intern, assign, deactivate/reactivate)

## Mentor
- Mentor dashboard with summary cards and charts
- Program creation, edit, and manual status management forms
- Reference materials upload UI (multiple per program)
- Roadmap review, edit, preview, and publish UI
- Task management and Kanban view
- Submission review and integer scoring UI (0–100)
- Manual weekly report generation, review, and approval UI
- Final summary review, approval, and PDF download UI

## Intern
- Intern dashboard with summary cards and charts
- Weekly learning objectives view
- Kanban task board
- Task submission form with multiple file uploads and optional external link
- View mentor feedback and integer scores
- View approved weekly reports
- View approved final summary and download PDF
