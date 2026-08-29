# Open Questions

All MVP planning questions are resolved. This document records confirmed decisions for reference during implementation.

---

## Resolved Decisions

### 1. Intern Skill Levels — Resolved

Use a **5-level scale**:

| Level | Label |
|-------|-------|
| 1 | Beginner |
| 2 | Basic |
| 3 | Intermediate |
| 4 | Advanced |
| 5 | Expert |

Documented in [shared/enums.md](../shared/enums.md) and [database-design.md](database-design.md).

---

### 2. Task Score Precision — Resolved

Task scores are **integers only**, range **0–100**. Decimal scores are not used.

---

### 3. AI Retry Policy — Resolved

If the AI returns invalid structured JSON:

1. Retry **once** (one retry after the initial attempt).
2. If the second attempt also fails, mark the generation request as **failed**.
3. Show a clear error to the Mentor.
4. Do **not** save invalid AI output.

---

### 4. AI Request Logging — Resolved

For the MVP, keep AI logging **basic**. Store only:

- AI feature type
- Request timestamp
- Success or failure status
- Error message, if applicable

Do **not** store full prompts or full AI responses in the MVP logging structure.

---

### 5. Reference Materials Storage — Resolved

Reference Materials belong to an **Internship Program**.

- One Internship Program may have **multiple** Reference Materials.
- Supported types: PDF files, documents, presentations, other supported files, external links.
- Materials are optional and may be used as context during roadmap generation.
- Implemented as a separate entity linked to InternshipProgram (see [database-design.md](database-design.md)).

---

### 6. Multiple Files per Submission — Resolved

Each Submission may contain:

- A written response
- **Multiple** uploaded files
- One optional external link
- Intern notes, where applicable

Each new submission version may contain its own uploaded files.

---

### 7. Program Status Transitions — Resolved

Program status changes are **manual**. The **Mentor** manages the status of programs they own.

Allowed statuses: DRAFT, ACTIVE, COMPLETED, ARCHIVED, CANCELLED.

Do **not** implement automatic status changes based on dates for the MVP.

---

### 8. Roadmap-to-Task Creation — Resolved

The AI-generated roadmap includes tasks for **all weeks** of the internship program.

Flow:

1. AI generates the full roadmap, including all weeks and all suggested tasks.
2. The generated roadmap remains in **Draft** status.
3. The Mentor reviews and may add, edit, delete, reorder, duplicate, or regenerate roadmap tasks.
4. The Mentor approves and **publishes** the roadmap.
5. After publication, **all approved roadmap tasks** are created as system Task records.
6. Tasks are assigned to interns included in the roadmap scope.
7. Each task is linked to its correct roadmap week.
8. Tasks appear in the task pipeline according to their assigned week.
9. Each intern receives a separate TaskAssignment record, even when the same task is assigned to multiple interns.
10. Interns submit and are reviewed individually.

Do **not** wait until each week begins to create its tasks. Do **not** depend on the weekly report to create future-week tasks. Weekly reports may recommend focus areas but do **not** automatically replace or create already approved roadmap tasks.

---

### 9. Weekly Report Timing — Resolved

Weekly reports are generated **manually** by the Mentor.

The Mentor may trigger report generation after reviewing submissions, assigning task scores, and providing relevant mentor feedback.

Do **not** schedule weekly reports automatically in the MVP.

---

### 10. Final Summary PDF Generation — Resolved

Use **ReportLab** as the planned PDF generation library for the MVP.

Documented as the selected approach. PDF generation is not implemented yet.

---

### 11. External Link Submissions — Resolved

External link submissions are **included in the MVP**.

A submission may include: written response, multiple uploaded files, and one optional external link.

---

### 12. Basic Dashboard Metrics — Resolved

Dashboards should be modern, clean, and visually appealing with summary cards, charts, and key metrics.

See [mvp-scope.md](mvp-scope.md#dashboards) for Admin, Mentor, and Intern dashboard metrics and charts.

UI is documentation only; not implemented yet.

---

### 13. Authentication Method — Resolved

Use **JWT (JSON Web Tokens)** for API authentication between Next.js and Django REST API.

- Frontend sends JWT in request headers after login.
- Backend validates tokens and enforces role-based permissions.
- Not implemented yet; documented for implementation phase.

---

### 14. File Upload Limits — Resolved

**Maximum size:** 20 MB per file.

**Allowed file types** (reference materials and task submissions):

| Extension |
|-----------|
| PDF |
| DOC |
| DOCX |
| PPT |
| PPTX |
| PNG |
| JPG |
| JPEG |
| TXT |
| CSV |
| ZIP |

External links on reference materials and submissions are URLs, not file uploads.

Validation is not implemented yet; rules documented in [shared/validation-rules.md](../shared/validation-rules.md) and [file-storage.md](file-storage.md).

---

### 15. AI Request Timeout — Resolved

**Timeout duration:** 60 seconds.

If an OpenAI request times out:

1. Cancel the request.
2. Mark the generation as **failed**.
3. Notify the Mentor with a clear error.
4. Allow **manual retry** by the Mentor.
5. Do **not** automatically retry after timeout.

Note: Automatic retry applies only to **invalid JSON** responses (one retry), not to timeouts.

---

## Status

All previously open questions are resolved. No remaining open questions at this time.

