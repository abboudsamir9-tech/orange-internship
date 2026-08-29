# Task Workflow

> **Status:** Documentation only. Not implemented.

## Kanban Statuses

| Status | Description |
|--------|-------------|
| `TO_DO` | Task assigned, not yet started |
| `IN_PROGRESS` | Intern is working on the task |
| `SUBMITTED` | Intern has submitted work for review |
| `NEEDS_REVISION` | Mentor requested changes |
| `COMPLETED` | Task finished and accepted |

## Allowed High-Level Transitions

```
TO_DO ──────────▶ IN_PROGRESS
IN_PROGRESS ────▶ SUBMITTED
SUBMITTED ──────▶ NEEDS_REVISION
SUBMITTED ──────▶ COMPLETED
NEEDS_REVISION ─▶ IN_PROGRESS
NEEDS_REVISION ─▶ SUBMITTED
```

- Interns update their own task assignment status.
- Mentor review (feedback, score) typically occurs when status is SUBMITTED or after resubmission from NEEDS_REVISION.

## Roadmap-to-Task Creation

When a Mentor publishes a roadmap:

1. All approved roadmap tasks for **all weeks** are created as system Task records immediately.
2. Tasks are assigned to interns included in the roadmap scope.
3. Each task is linked to its correct roadmap week.
4. Tasks appear in the pipeline according to their assigned week.
5. Each intern receives a separate **TaskAssignment** record, even when the same task is assigned to multiple interns.

Do **not** wait until each week begins to create tasks. Weekly reports may recommend focus but do **not** create or replace approved roadmap tasks.

## Multiple Assignment Rule

- One Task may be assigned to multiple interns.
- Each intern receives a separate **TaskAssignment** record.
- Each TaskAssignment has its own status, deadline, score, and feedback.

## Individual Submission Rule

- When a task is assigned to multiple interns, each intern submits individually.
- Submissions belong to a TaskAssignment, not directly to the Task.

## Multiple Submission Rule

- An intern may make multiple submissions for the same task assignment.
- Each submission has a version number and submission date.
- Each new submission version may contain its own uploaded files.
- Mentor reviews the latest or selected submission (implementation detail).

## Submission Content

A submission may contain:

- Written response
- Multiple uploaded files
- One optional external link
- Submission date
- Submission version
- Intern notes

## Mentor Review Rule

- Mentor reviews each intern's submission individually.
- Mentor provides feedback (text).
- Mentor assigns a score out of **100** (integer only).

## Score Range

- Task scores: **0–100**, **integers only** (no decimals)
