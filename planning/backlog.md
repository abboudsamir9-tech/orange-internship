# Backlog

Confirmed MVP features only. No story points or estimates.

## Frontend

- Set up Next.js project
- Configure API client with base URL
- Admin dashboard (summary cards and charts — see docs/mvp-scope.md)
- Mentor dashboard (summary cards and charts — see docs/mvp-scope.md)
- Intern dashboard (summary cards and charts — see docs/mvp-scope.md)
- Program creation and edit forms (Mentor)
- Manual program status management UI (Mentor)
- Roadmap review and edit UI (Mentor)
- Roadmap publish and preview (Mentor)
- Kanban task board (Intern, Mentor view)
- Task submission form with multiple file uploads and optional external link (Intern)
- Submission review and integer scoring UI (Mentor)
- Weekly report manual generation, review, and approval UI (Mentor)
- Weekly report view (Intern, approved only)
- Final summary review and approval UI (Mentor)
- Final summary view and PDF download (Mentor, Intern)
- Reference materials upload UI — multiple per program (Mentor)
- Role-based navigation, route protection, and JWT token handling

## Backend

- Initialize Django project and DRF
- PostgreSQL configuration
- Local media storage configuration
- User model with roles
- JWT authentication and role-based permissions
- File upload validation (20 MB max; allowed types per shared/enums.md)
- Admin user management endpoints
- InternshipProgram CRUD with manual status transitions (Mentor)
- InternProfile and skills management (skill levels 1–5)
- ReferenceMaterial model — multiple per program
- Roadmap model and draft/publish workflow
- Task creation on roadmap publish (all weeks, all tasks)
- Task and TaskAssignment models
- Kanban status transitions
- Submission model with multiple files and optional external link
- Mentor feedback and integer scoring (0–100)
- WeeklyReport model and manual generation/approval workflow
- FinalSummary model and PDF generation (ReportLab)
- AIRequestLog model — basic logging only
- Dashboard data endpoints (Admin, Mentor, Intern)
- Admin monitoring endpoints
- Intern account deactivation on program completion

## AI

- OpenAI SDK integration in Django (generators/)
- Prompt Builder modules (Stage 1) for all three features
- Generator modules (Stage 2) for roadmap, weekly report, final summary
- Output schema validators (`roadmap_output.json`, etc.)
- Base prompt templates for Prompt Builder (not sent directly to LLM)
- AI error handling — retry once on invalid JSON; 60s timeout with manual retry only
- Basic AI request logging (feature type, timestamp, status, error message)
- Reference material context in roadmap Prompt Builder

## Integration

- Connect frontend to backend API
- End-to-end roadmap generation and publish-to-tasks flow
- End-to-end task submission and review flow
- End-to-end manual weekly report flow
- End-to-end final summary and ReportLab PDF flow
- File upload integration (reference materials, multiple submission files)

## Testing

- Backend unit tests for models and permissions
- API integration tests
- AI schema validation and retry logic tests
- End-to-end user journey tests
- Deployment configuration (when requested)
