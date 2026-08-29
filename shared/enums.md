# Shared Enums

Confirmed enum values for the MVP. Do not add values without approval.

## User Roles

| Value | Description |
|-------|-------------|
| `ADMIN` | System administrator |
| `MENTOR` | Internship program manager |
| `INTERN` | Internship participant |

## Program Statuses

| Value | Description |
|-------|-------------|
| `DRAFT` | Program created but not active |
| `ACTIVE` | Program in progress |
| `COMPLETED` | Program finished |
| `ARCHIVED` | Program archived by Admin |
| `CANCELLED` | Program cancelled |

Program status changes are **manual**. The Mentor manages status for programs they own. No automatic transitions based on dates.

## Roadmap Statuses

| Value | Description |
|-------|-------------|
| `DRAFT` | Roadmap being edited, not visible to interns |
| `PUBLISHED` | Roadmap approved and active |
| `ARCHIVED` | Roadmap no longer active |

## Roadmap Scopes

| Value | Description |
|-------|-------------|
| `PROGRAM` | Applies to all interns in the program |
| `GROUP` | Applies to selected interns |
| `INDIVIDUAL` | Applies to one intern |

## Task Statuses

| Value | Description |
|-------|-------------|
| `TO_DO` | Not started |
| `IN_PROGRESS` | In progress |
| `SUBMITTED` | Submitted for review |
| `NEEDS_REVISION` | Revision requested |
| `COMPLETED` | Completed |

## AI Content Statuses

| Value | Description |
|-------|-------------|
| `DRAFT` | AI-generated, pending mentor review |
| `APPROVED` | Approved by mentor |
| `REJECTED` | Rejected by mentor |

## Task Source

| Value | Description |
|-------|-------------|
| `AI_GENERATED` | Created from AI roadmap |
| `MANUAL` | Created manually by mentor |

## Task Requirement Type

| Value | Description |
|-------|-------------|
| `REQUIRED` | Required task |
| `OPTIONAL` | Optional task |

## Intern Skill Levels

Integer scale from 1 to 5:

| Level | Label |
|-------|-------|
| `1` | Beginner |
| `2` | Basic |
| `3` | Intermediate |
| `4` | Advanced |
| `5` | Expert |

Used on InternSkill records.

## AI Feature Types (Logging)

| Value | Description |
|-------|-------------|
| `ROADMAP_GENERATION` | Initial roadmap generation |
| `WEEKLY_REPORT` | Weekly performance report |
| `FINAL_SUMMARY` | Final internship summary |

Used for basic AI request logging in the MVP.

## AI Request Status (Logging)

| Value | Description |
|-------|-------------|
| `SUCCESS` | AI request completed and output validated |
| `FAILURE` | AI request failed after retry or validation failure |

## Allowed Upload File Types

Maximum **20 MB per file**. Applies to reference materials and task submission uploads.

| Extension |
|-----------|
| `PDF` |
| `DOC` |
| `DOCX` |
| `PPT` |
| `PPTX` |
| `PNG` |
| `JPG` |
| `JPEG` |
| `TXT` |
| `CSV` |
| `ZIP` |

External links are URLs, not file uploads.

## Authentication

| Method | Description |
|--------|-------------|
| `JWT` | JSON Web Tokens for API authentication |
