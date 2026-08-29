# Shared Statuses

Reference for status values used across entities. See [enums.md](enums.md) for full enum definitions.

## Entity Status Mapping

| Entity | Status Field | Values |
|--------|--------------|--------|
| User | `is_active` | boolean (deactivated after program completion for interns) |
| InternshipProgram | `status` | DRAFT, ACTIVE, COMPLETED, ARCHIVED, CANCELLED |
| Roadmap | `status` | DRAFT, PUBLISHED, ARCHIVED |
| TaskAssignment | `status` | TO_DO, IN_PROGRESS, SUBMITTED, NEEDS_REVISION, COMPLETED |
| WeeklyReport | `status` | DRAFT, APPROVED, REJECTED |
| FinalSummary | `status` | DRAFT, APPROVED, REJECTED |
| AIRequestLog | `status` | SUCCESS, FAILURE |

## Program Status Transitions

- Status changes are **manual**.
- The **Mentor** updates program status for programs they own.
- No automatic status changes based on start date, end date, or calendar week.
- Admin may archive or delete programs (see roles-and-permissions.md).

## AI Content Draft Rule

All AI-generated content (Roadmap, WeeklyReport, FinalSummary) starts as **DRAFT** until Mentor approval.

## Task Assignment Workflow

See [../docs/task-workflow.md](../docs/task-workflow.md) for Kanban transitions.

## Published Roadmap Rule

A published roadmap can return to Draft only if no tasks have started. Versioning not implemented in MVP.

On publish, all approved roadmap tasks for all weeks are created as Task records immediately and assigned per roadmap scope.
