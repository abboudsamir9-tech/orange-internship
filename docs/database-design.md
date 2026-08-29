# Database Design

> **Status:** Documentation only. No Django models implemented.

Keep the database simple for the MVP. Do not create unnecessary tables. Use JSON fields where AI-generated content or nested structures would otherwise require heavy normalization.

## Confirmed Business Rules

- One intern has one mentor.
- One intern belongs to one internship program for the MVP.
- One program has one mentor.
- One mentor can manage more than one program.
- One program represents one role only.
- A task may be assigned to multiple interns.
- Each task assignment is tracked separately for each intern.
- When a task is assigned to multiple interns, they submit individually.
- An intern can make multiple submissions for one task assignment.
- Task scores are integers from 0–100 (no decimals).
- Program status changes are manual by Mentor (no automatic date-based transitions).
- On roadmap publish, all approved tasks for all weeks are created immediately as Task records.
- Mentors can manually create tasks.
- Mentors can change deadlines after task assignment.
- AI-generated content remains a draft until mentor approval.
- Admin can view program content but cannot edit it.
- Final internship summaries can be downloaded as PDF.
- Admin may choose to delete or deactivate users.
- Admin may choose to archive or delete programs.
- File uploads are stored locally during development.
- Roadmap scope determines whether it applies to the entire program, selected interns, or one individual intern.

---

## Entity: User

**Purpose:** Base account for Admin, Mentor, and Intern.

**Relationships:**
- One User may have one InternProfile (if role is INTERN)
- One User (Mentor) may manage many InternshipPrograms
- One User (Mentor) may have many assigned InternProfiles

**Suggested fields:**
- `id` (PK)
- `email`
- `password` (hashed)
- `first_name`, `last_name`
- `role` — ADMIN | MENTOR | INTERN
- `is_active`
- `created_at`, `updated_at`

**Constraints:**
- Role determines permissions
- Intern accounts deactivated after program completion; Admin can reactivate

---

## Entity: InternshipProgram

**Purpose:** Defines an internship program created by a Mentor.

**Relationships:**
- Belongs to one Mentor (User)
- Has many InternProfiles (MVP: one intern per program)
- Has many Roadmaps, Tasks, Reference Materials

**Suggested fields:**
- `id` (PK)
- `mentor` (FK → User)
- `title`
- `description`
- `role` — the internship role (e.g., "Software Engineering Intern")
- `start_date`, `end_date`
- `duration_weeks`
- `skills_to_develop` (JSON array or related Skill records)
- `goals` (text)
- `skills_needed` (JSON array or text)
- `expected_outcome` (text)
- `final_project` (text, optional)
- `status` — DRAFT | ACTIVE | COMPLETED | ARCHIVED | CANCELLED
- `max_interns`
- `department`
- `weekly_hours`
- `additional_instructions` (text, optional)
- `created_at`, `updated_at`

**Constraints:**
- One program has one mentor
- One program represents one role only
- Admin can view but not edit
- Status changes are manual by Mentor (DRAFT, ACTIVE, COMPLETED, ARCHIVED, CANCELLED)

---

## Entity: ReferenceMaterial

**Purpose:** Optional files and links attached to an internship program for AI roadmap context.

**Relationships:**
- Belongs to one InternshipProgram
- One program may have many Reference Materials

**Suggested fields:**
- `id` (PK)
- `program` (FK → InternshipProgram)
- `title` (optional)
- `file` (file path, optional — for PDF, document, presentation, other files)
- `external_link` (URL, optional)
- `material_type` — FILE | LINK (or inferred from fields)
- `created_at`, `updated_at`

**Constraints:**
- At least one of `file` or `external_link` must be present
- File uploads: max 20 MB per file; allowed types PDF, DOC, DOCX, PPT, PPTX, PNG, JPG, JPEG, TXT, CSV, ZIP
- Optional; used during roadmap generation as AI context

---

## Entity: InternProfile

**Purpose:** Extended profile for an Intern user linked to a program and mentor.

**Relationships:**
- One-to-one with User (INTERN role)
- Belongs to one Mentor (User)
- Belongs to one InternshipProgram (MVP)
- Has many InternSkills
- Has many TaskAssignments, WeeklyReports, FinalSummaries

**Suggested fields:**
- `id` (PK)
- `user` (FK → User, one-to-one)
- `mentor` (FK → User)
- `program` (FK → InternshipProgram)
- `personal_info` (JSON or text fields — name, contact, etc.)
- `preferences` (JSON, optional)
- `learning_goals` (text or JSON)
- `created_at`, `updated_at`

**Constraints:**
- One intern, one mentor, one program (MVP)

---

## Entity: Skill

**Purpose:** Catalog of skills that can be associated with interns and programs.

**Relationships:**
- Referenced by InternSkill
- May be referenced in program `skills_to_develop` / `skills_needed`

**Suggested fields:**
- `id` (PK)
- `name`
- `description` (optional)

---

## Entity: InternSkill

**Purpose:** Tracks an intern's skill and proficiency level.

**Relationships:**
- Belongs to InternProfile
- References Skill

**Suggested fields:**
- `id` (PK)
- `intern_profile` (FK → InternProfile)
- `skill` (FK → Skill)
- `level` — integer 1–5: 1 Beginner, 2 Basic, 3 Intermediate, 4 Advanced, 5 Expert

---

## Entity: Roadmap

**Purpose:** AI-generated or mentor-edited learning roadmap for a program or subset of interns.

**Relationships:**
- Belongs to InternshipProgram
- May apply to all interns (PROGRAM scope) or selected interns (GROUP / INDIVIDUAL)
- Contains weekly structure (JSON field recommended)

**Suggested fields:**
- `id` (PK)
- `program` (FK → InternshipProgram)
- `title`
- `summary`
- `scope` — PROGRAM | GROUP | INDIVIDUAL
- `status` — DRAFT | PUBLISHED | ARCHIVED
- `number_of_weeks`
- `weeks` (JSON — week number, focus, objectives, suggested tasks, expected skills, mentor notes)
- `assigned_intern_ids` (JSON array, for GROUP / INDIVIDUAL scope)
- `created_at`, `updated_at`, `published_at`

**Constraints:**
- Draft until mentor publishes
- Published roadmap returns to Draft only if no tasks have started (versioning deferred)
- AI-generated content stored as draft until approval

**Notes:**
- Full week/task structure can live in a JSON field to avoid over-normalization
- AI generates tasks for **all weeks** in the draft roadmap
- On **publish**, all approved roadmap tasks are created as Task records for all weeks immediately (not week-by-week)
- Tasks are assigned to interns per roadmap scope; each intern gets a separate TaskAssignment
- Weekly reports do not create or replace roadmap tasks

---

## Entity: Task

**Purpose:** A task that can be assigned to one or more interns.

**Relationships:**
- Belongs to InternshipProgram (and optionally linked to Roadmap week)
- Has many TaskAssignments

**Suggested fields:**
- `id` (PK)
- `program` (FK → InternshipProgram)
- `roadmap` (FK → Roadmap, optional)
- `week_number` (optional)
- `title`
- `description`
- `difficulty`
- `estimated_time`
- `deliverable`
- `success_criteria`
- `priority` (optional)
- `source` — AI_GENERATED | MANUAL
- `requirement_type` — REQUIRED | OPTIONAL
- `default_deadline` (optional)
- `created_at`, `updated_at`

---

## Entity: TaskAssignment

**Purpose:** Individual assignment of a task to one intern with per-intern status, score, and feedback.

**Relationships:**
- Belongs to Task
- Belongs to InternProfile
- Has many Submissions

**Suggested fields:**
- `id` (PK)
- `task` (FK → Task)
- `intern_profile` (FK → InternProfile)
- `status` — TO_DO | IN_PROGRESS | SUBMITTED | NEEDS_REVISION | COMPLETED
- `deadline` (may differ per intern; mentor can change after assignment)
- `score` (integer 0–100, nullable until scored; no decimals)
- `mentor_feedback` (text, optional)
- `completed_at` (optional)
- `created_at`, `updated_at`

**Constraints:**
- Each intern tracked separately even when same task assigned to multiple interns

---

## Entity: Submission

**Purpose:** A submission version for a task assignment.

**Relationships:**
- Belongs to TaskAssignment

**Suggested fields:**
- `id` (PK)
- `task_assignment` (FK → TaskAssignment)
- `written_response` (text, optional)
- `files` (one-to-many SubmissionFile or JSON array of file paths)
- `external_link` (URL, optional — one per submission)
- `submission_version` (integer)
- `intern_notes` (text, optional)
- `submitted_at`

**Constraints:**
- Multiple submissions allowed per task assignment
- Each submission may include multiple uploaded files (max 20 MB each; allowed types per shared/enums.md) and one optional external link
- Each new submission version may contain its own uploaded files

---

## Entity: SubmissionFile (optional normalization)

**Purpose:** Store multiple uploaded files per submission.

**Relationships:**
- Belongs to Submission

**Suggested fields:**
- `id` (PK)
- `submission` (FK → Submission)
- `file` (file path)
- `original_filename` (optional)
- `uploaded_at`

**Notes:**
- Alternatively, file paths may be stored as a JSON array on Submission if simpler for MVP

---

## Entity: WeeklyReport

**Purpose:** AI-generated weekly performance report for one intern.

**Relationships:**
- Belongs to InternProfile
- Belongs to InternshipProgram
- Associated with a specific week number

**Suggested fields:**
- `id` (PK)
- `intern_profile` (FK → InternProfile)
- `program` (FK → InternshipProgram)
- `week_number`
- `status` — DRAFT | APPROVED | REJECTED
- `content` (JSON — performance summary, achievements, learning progress, productivity analysis, mentor focus suggestions, recommended focus)
- `created_at`, `updated_at`, `approved_at`

**Constraints:**
- Generated per intern
- Draft until mentor approves
- Visible to intern only after approval

---

## Entity: FinalSummary

**Purpose:** AI-generated end-of-internship summary for one intern.

**Relationships:**
- Belongs to InternProfile
- Belongs to InternshipProgram

**Suggested fields:**
- `id` (PK)
- `intern_profile` (FK → InternProfile)
- `program` (FK → InternshipProgram)
- `status` — DRAFT | APPROVED | REJECTED
- `content` (JSON — overall performance, learning journey, achievements, skills developed, strengths, areas for improvement, goal achievement, final performance summary)
- `mentor_final_score` (optional)
- `mentor_final_comments` (text, optional)
- `pdf_file` (file path, optional — generated on approval)
- `created_at`, `updated_at`, `approved_at`

**Constraints:**
- Draft until mentor approves
- Approved summary downloadable as PDF (generated with **ReportLab**)

---

## Entity: AIRequestLog

**Purpose:** Basic MVP logging for AI generation requests.

**Suggested fields:**
- `id` (PK)
- `feature_type` — ROADMAP_GENERATION | WEEKLY_REPORT | FINAL_SUMMARY
- `requested_at` (timestamp)
- `status` — SUCCESS | FAILURE
- `error_message` (text, optional)

**Constraints:**
- Do **not** store full prompts or full AI responses in MVP
- Log success/failure only for monitoring and debugging
