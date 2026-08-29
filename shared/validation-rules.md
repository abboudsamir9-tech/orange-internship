# Validation Rules

> **Status:** Documentation only. Not implemented.

Confirmed validation rules for the MVP.

## User

- Email required and unique
- Role must be ADMIN, MENTOR, or INTERN
- Intern belongs to one mentor and one program (MVP)

## InternshipProgram

- Title required
- Start date before or equal to end date
- Duration in weeks must align with date range (implementation detail)
- Max interns must be positive integer
- Weekly hours must be positive
- Status must be valid program status enum
- One mentor per program
- Status changes are manual by Mentor (no automatic date-based transitions)

## InternProfile

- Must link to User with INTERN role
- Must link to one mentor and one program

## InternSkill

- `level` must be integer 1–5 (Beginner through Expert)

## TaskAssignment

- Score range: **0–100**, **integers only** (no decimals)
- Status must be valid task status enum
- One assignment per task-intern pair

## Submission

- May include: written response, multiple uploaded files, one optional external link, intern notes
- At least one of: written_response, uploaded file(s), or external_link should be present
- Submission version increments with each new submission
- Each submission version may have its own uploaded files

## ReferenceMaterial

- Must belong to an InternshipProgram
- One program may have multiple reference materials
- File uploads: max **20 MB** per file; allowed types PDF, DOC, DOCX, PPT, PPTX, PNG, JPG, JPEG, TXT, CSV, ZIP
- External links allowed (URL, not subject to file type rules)
- Optional; used as AI context for roadmap generation

## Submission Files

- Multiple files per submission allowed
- Max **20 MB** per file
- Allowed types: PDF, DOC, DOCX, PPT, PPTX, PNG, JPG, JPEG, TXT, CSV, ZIP
- One optional external link per submission (URL)

## Roadmap

- Scope must be PROGRAM, GROUP, or INDIVIDUAL
- GROUP and INDIVIDUAL scope require assigned intern IDs
- Cannot publish without mentor action
- Published → Draft only if no tasks started
- On publish: all approved roadmap tasks for all weeks become Task records assigned per scope

## WeeklyReport / FinalSummary

- Status must be DRAFT, APPROVED, or REJECTED
- Intern visibility only when APPROVED
- Weekly reports triggered manually by Mentor (not scheduled)
- Final summary PDF generated on approval using **ReportLab**

## AI Response Validation

- Must match output schema in `ai/schemas/` for respective feature (e.g. `roadmap_output.json`)
- On invalid JSON: retry once; if second attempt fails, mark request failed, show error to Mentor, do not save invalid output
- Request timeout: **60 seconds**; on timeout cancel request, mark failed, notify Mentor, allow manual retry only (no automatic retry)

## AI Request Logging

- Log only: feature type, request timestamp, success/failure status, error message if applicable
- Do not log full prompts or full AI responses in MVP

## File Uploads

- Stored locally during MVP
- Maximum size: **20 MB per file**
- Allowed types: PDF, DOC, DOCX, PPT, PPTX, PNG, JPG, JPEG, TXT, CSV, ZIP
- Same rules apply to reference materials and task submission files
- Validation not implemented yet
