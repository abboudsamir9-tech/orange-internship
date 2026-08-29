# Implementation Order

> **Status:** Recommended sequence only. None of these steps have been started.

## Recommended Order

1. **Backend foundation** — Django project setup, PostgreSQL connection, environment configuration, local media settings
2. **User and role system** — User model, roles (Admin, Mentor, Intern), authentication, role-based permissions
3. **Programs and intern profiles** — InternshipProgram, InternProfile, Skill, InternSkill, reference materials storage
4. **Roadmaps** — Roadmap model, draft/publish workflow, scope handling (PROGRAM, GROUP, INDIVIDUAL)
5. **Tasks and assignments** — Task, TaskAssignment, Kanban statuses, deadline management
6. **Submissions and reviews** — Submission model, file uploads, mentor feedback and scoring
7. **Weekly reports** — WeeklyReport model, draft/approve workflow, intern visibility rules
8. **Final summaries and PDFs** — FinalSummary model, PDF generation, download endpoint
9. **Frontend integration** — Next.js app, API client, role-based dashboards and flows
10. **AI integration** — Prompt Builder, generators, OpenAI SDK, output schema validation, draft storage for all three AI features
11. **Testing and deployment** — Integration tests, deployment configuration (when requested)

## Dependencies

```
Backend foundation
    └── User and role system
            └── Programs and intern profiles
                    └── Roadmaps
                            └── Tasks and assignments
                                    └── Submissions and reviews
                                            ├── Weekly reports
                                            └── Final summaries and PDFs
                                                    └── Frontend integration
                                                            └── AI integration
                                                                    └── Testing and deployment
```

## Notes

- AI integration can be stubbed earlier with manual draft creation for testing non-AI flows.
- Frontend can begin in parallel after API contracts are defined, but full integration follows backend readiness.
- Do not start any step until explicitly requested.
