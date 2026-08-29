# AI Features

> **Status:** Documentation only. Not implemented.

All AI features follow the same **two-stage architecture** and approval pattern:

1. **Stage 1 — AI Prompt Builder:** Django collects data; Prompt Builder returns one optimized prompt.
2. **Stage 2 — AI Generation:** Generated prompt sent to LLM; response validated and saved as **Draft**.
3. **Mentor** reviews, edits, regenerates, approves, or publishes (when applicable).

Static prompt templates are **not** sent directly to the LLM.

```
Mentor Input → Django Collects Data → AI Prompt Builder → Generated Prompt
→ OpenAI LLM API → Structured JSON → Validation → Draft → Mentor Review & Approval
```

---

## Feature 1: Initial Roadmap Generation

### Trigger

Mentor requests roadmap generation after selecting scope (PROGRAM, GROUP, or INDIVIDUAL).

### Stage 1 — Prompt Builder Context

- Program information (title, description, role, dates, duration, goals, skills, outcomes, final project)
- Roadmap scope
- Assigned intern(s) when applicable
- Skills and skill levels (1–5)
- Learning goals and preferences
- Weekly hours, department, expected outcome, additional instructions
- Reference materials (from ReferenceMaterial records)

The Prompt Builder (`roadmap_prompt_builder.py`) uses `prompts/roadmap_template.md` to produce one optimized prompt.

### Stage 2 — LLM Output

**Roadmap-level:**
- Roadmap title, summary, number of weeks

**Per week:**
- Week number, weekly focus, learning objectives
- Suggested tasks (title, description, difficulty, estimated time, deliverable, success criteria)
- Expected skills gained, mentor notes (optional)

Tasks for **all weeks** are generated in one LLM response. Validated against `schemas/roadmap_output.json`.

### Draft and Approval

- Generated as **DRAFT**
- Mentor can freely edit, reorder, add, delete, duplicate, and regenerate while in Draft
- Becomes active only after Mentor **publishes**
- Published roadmap returns to Draft only if no tasks have started (versioning not implemented)

### Publish and Task Creation

On publish:

1. All approved roadmap tasks for all weeks become system Task records.
2. Tasks are assigned to interns per roadmap scope.
3. Each task is linked to its roadmap week.
4. Each intern receives a separate TaskAssignment.
5. Tasks appear in the pipeline by assigned week.

Do not wait for each week to start. Do not use weekly reports to create future-week tasks.

### Mentor Editing

See approved requirements for roadmap-level, week-level, and task-level edits including regenerate, simplify, increase difficulty, add supporting task, suggest alternative, reject AI suggestion, and keep original.

---

## Feature 2: Weekly Performance Report

### Trigger

Mentor **manually** generates a report for an intern for a given week (after reviewing submissions, scores, and feedback).

Do **not** schedule weekly reports automatically in the MVP.

### Stage 1 — Prompt Builder Context

- Planned weekly objectives
- Assigned, completed, and incomplete tasks
- Task completion rate, submission history, scores (integers 0–100)
- Mentor feedback, missed and overdue deadlines

The Prompt Builder (`weekly_report_prompt_builder.py`) uses `prompts/weekly_report_template.md`.

### Stage 2 — LLM Output

- Performance Summary, Achievements, Learning Progress
- Productivity Analysis, Mentor Focus Suggestions
- Recommended focus for the following week (where applicable)

Validated against `schemas/weekly_report_output.json`. Recommended focus is advisory only — does **not** create or replace roadmap tasks.

### Draft and Approval

- Generated **per intern**, remains **DRAFT**
- Mentor can edit, regenerate, and approve
- Visible to Intern **only after Mentor approval**

### Not Included

- Weekly reflection (intern-submitted) — not part of MVP
- Automatic weekly report scheduling

---

## Feature 3: Final Internship Summary

### Trigger

After internship completion; Mentor **manually** initiates generation.

### Stage 1 — Prompt Builder Context

- Initial internship roadmap
- Weekly performance reports
- Assigned, completed, and incomplete tasks
- Task scores, submission history, mentor feedback
- Skills developed, final project (if applicable)

The Prompt Builder (`final_summary_prompt_builder.py`) uses `prompts/final_summary_template.md`.

### Stage 2 — LLM Output

- Overall Performance Summary, Learning Journey, Main Achievements
- Skills Developed, Strengths, Areas for Improvement
- Goal Achievement, Final Performance Summary

Validated against `schemas/final_summary_output.json`.

### Workflow

1. Internship completed
2. System gathers intern's complete program history
3. Prompt Builder → LLM → validated draft final summary
4. Mentor reviews, edits, or regenerates
5. Mentor adds final score or comments
6. Mentor approves
7. Approved summary stored
8. Approved summary downloadable as PDF (ReportLab)

### Restrictions

- AI does not make hiring decisions
- No automatic hiring recommendation

---

## AI Error Handling (All Features)

### Invalid JSON

If the LLM returns invalid structured JSON:

1. Retry generation once.
2. If the second attempt fails, mark the generation request as failed.
3. Show a clear error to the Mentor.
4. Do not save invalid AI output.

### Timeout (60 seconds)

If the OpenAI request times out:

1. Cancel the request.
2. Mark the generation as failed.
3. Notify the Mentor with a clear error.
4. Allow manual retry by the Mentor.
5. Do **not** automatically retry after timeout.
