# MVP Scope

## Included Features

### Users and Roles
- Admin, Mentor, and Intern roles with role-based permissions
- JWT (JSON Web Tokens) for API authentication

### Programs
- Internship program creation by Mentor
- Program details: title, description, role, dates, duration, skills, goals, outcomes, reference materials, and more
- Manual program status management by Mentor (DRAFT, ACTIVE, COMPLETED, ARCHIVED, CANCELLED)
- Admin can view but not edit program content
- Admin can archive or delete programs

### Intern Profiles
- Skills, skill levels (1–5 scale), preferences, personal information, learning goals
- One intern, one mentor, one program (MVP)

### Roadmaps
- AI roadmap generation with scope: entire program, selected interns, or individual intern
- Full multi-week roadmap generated in one AI request
- On publish, all approved tasks for all weeks created immediately
- Mentor review, edit, and publish workflow
- Draft status until approved

### Tasks
- Kanban board with statuses: TO_DO, IN_PROGRESS, SUBMITTED, NEEDS_REVISION, COMPLETED
- Manual task creation by Mentor
- Assign one task to multiple interns (tracked individually)
- Mentor feedback and integer scoring (0–100)

### Submissions
- Written responses, multiple file uploads, and one optional external link per submission
- Multiple submissions per task assignment
- Each submission version may include its own files

### Weekly Reports
- AI-generated weekly performance reports per intern
- Manually triggered by Mentor (not scheduled)
- Mentor review, edit, regenerate, and approve
- Visible to intern only after approval

### Final Summaries
- AI-generated final internship summary
- Mentor review, edit, final score/comments, and approve
- PDF download of approved summary (ReportLab)

### Dashboards

Modern, clean, visually appealing dashboards with summary cards, charts, and key metrics. Responsive layout with progress indicators; simple and uncluttered. UI not implemented yet.

**Admin Dashboard**

Summary cards:
- Total mentors
- Total interns
- Active programs
- Overall task activity
- Overall submission activity
- Overall weekly report activity
- Overall final summary activity

Charts:
- Programs by status
- Intern distribution across mentors
- Task completion overview
- Submission trends
- Weekly report approval status

**Mentor Dashboard**

Summary cards:
- Assigned interns
- Programs managed
- Tasks waiting for review
- Weekly reports waiting for approval

Charts:
- Task completion progress
- Submission status
- Intern performance overview
- Average intern scores
- Weekly workload distribution

**Intern Dashboard**

Summary cards:
- Current assigned tasks
- Upcoming deadlines
- Completed tasks
- Recent mentor feedback
- Approved weekly reports

Charts:
- Personal task completion progress
- Weekly learning progress
- Score history
- Completed vs remaining tasks

### File Storage
- Local file storage during MVP development
- Reference materials (allowed file types; 20 MB max per file) and external links
- Task submission uploads (same file rules)
- Generated PDFs (ReportLab)

## Explicitly Excluded Features

- Weekly reflection (intern-submitted)
- Chat or messaging
- Notifications
- GitHub integration
- Figma integration
- Predictive analytics
- Automatic hiring decisions or hiring recommendations
- Company knowledge RAG
- Advanced HR analytics
- Cloud storage implementation
- Team collaboration features
- Roadmap versioning implementation
- Audit systems
- Background workers, Celery, Redis
- Docker infrastructure
- CI/CD pipelines
- Microservices, message queues, caching, event buses

## Phase 2 Items (Not in MVP)

- Weekly reflection workflow
- Cloud file storage migration
- Roadmap versioning

## No Speculative Features

This MVP includes only the features listed in the approved requirements. Additional capabilities should be proposed and approved before being added to scope.
