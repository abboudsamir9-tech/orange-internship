# Backend Tasks

> **Status:** Planning only. Not started.

See [backlog.md](backlog.md) for the full list. Grouped by app.

## Foundation
- Initialize Django project and DRF
- PostgreSQL configuration
- Local media storage configuration
- Environment variable setup

## accounts
- User model with roles (ADMIN, MENTOR, INTERN)
- JWT authentication
- Role-based permissions
- Admin user management endpoints
- Assign intern to mentor
- Deactivate/reactivate accounts

## programs
- InternshipProgram model and CRUD
- Manual program status transitions by Mentor
- InternProfile model
- Skill and InternSkill models (levels 1–5)
- ReferenceMaterial model — multiple per program; file validation (20 MB, allowed types)
- Program status management

## roadmaps
- Roadmap model with JSON week structure
- Scope handling (PROGRAM, GROUP, INDIVIDUAL)
- Draft and publish workflow
- On publish: create all Task records for all weeks
- Endpoint to trigger AI generation (stub until AI ready)

## tasks
- Task model (linked to roadmap week)
- TaskAssignment model with Kanban statuses
- Task assignment to multiple interns (separate record per intern)
- Deadline management
- Manual task creation

## submissions
- Submission model with multiple files and optional external link
- File upload validation (20 MB max; allowed types per shared/enums.md)
- Multiple submissions per assignment (each version with own files)
- Mentor feedback and integer scoring (0–100)

## reports
- WeeklyReport model — manual generation and approval workflow
- FinalSummary model and approval workflow
- PDF generation with ReportLab for approved final summary
- AIRequestLog model — basic logging (no full prompts/responses)
- Endpoints to trigger AI generation (stub until AI ready)

## Admin
- Monitoring/overview endpoints
- Dashboard data endpoints (metrics and charts)

## common / services / permissions
- Shared utilities
- Business logic services
- Permission classes per role

## tests
- Placeholder test suite structure
