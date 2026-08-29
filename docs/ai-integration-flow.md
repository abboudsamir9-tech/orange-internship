# AI Integration Flow

> **Status:** Future integration flow only. Not implemented.

## Architecture Overview

Every AI feature follows a **two-stage** process. Static prompt templates are **not** sent directly to the LLM.

```
Mentor Input
     ↓
Django Collects Data
     ↓
AI Prompt Builder          (Stage 1)
     ↓
Generated Prompt
     ↓
OpenAI LLM API             (Stage 2)
     ↓
Structured JSON
     ↓
Validation
     ↓
Draft
     ↓
Mentor Review & Approval
```

---

## Stage 1 — AI Prompt Builder

Django collects structured context from the database, then the **Prompt Builder** assembles one optimized prompt.

### Roadmap generation context

- Program information
- Roadmap scope
- Assigned intern(s) when applicable
- Skills and skill levels
- Learning goals
- Weekly hours, duration, department
- Expected outcome and additional instructions
- Reference materials

### Prompt Builder requirements

The generated prompt must be:

- Clear and structured
- Complete with all relevant context
- Aligned with business rules
- Scoped correctly (PROGRAM, GROUP, INDIVIDUAL)
- Enriched with reference materials where applicable
- Free of invented requirements or unapproved features

**Output of Stage 1:** one optimized prompt (not saved to AIRequestLog in MVP).

---

## Stage 2 — AI Generation

The generated prompt is sent to the **OpenAI LLM API** via the official Python SDK.

The LLM produces structured JSON for the requested feature:

- Roadmap
- Weekly Performance Report
- Final Internship Summary

---

## End-to-End Flow

1. **Mentor triggers an AI feature** from the frontend.
2. **Next.js sends identifiers** to Django REST API.
3. **Django collects required data** (program, intern profiles, tasks, submissions, reference materials, etc.).
4. **AI Prompt Builder** (`ai/prompt_builder/`) assembles context using base templates from `ai/prompts/` and returns one optimized prompt.
5. **AI Generator** (`ai/generators/`) sends the prompt to the OpenAI API (60-second timeout).
6. **The API key** remains in `OPENAI_API_KEY` (never exposed to frontend).
7. **The LLM returns structured JSON** for the feature.
8. **Validator** (`ai/validators/`) checks JSON against `ai/schemas/` output schema.
9. **On validation failure:** retry generation once; if second attempt fails, mark failed, notify Mentor, do not save invalid output.
10. **On validation success:** save as **Draft** in the database.
11. **Mentor** reviews, edits, regenerates, approves, or publishes (when applicable).

---

## Placeholder Components

| Location | Stage | Purpose |
|----------|-------|---------|
| `ai/prompt_builder/` | 1 | Build optimized prompts from structured context |
| `ai/prompts/` | 1 | Base templates used by Prompt Builder (not sent directly to LLM) |
| `ai/generators/` | 2 | Call OpenAI API with generated prompt |
| `ai/validators/` | 2 | Validate LLM JSON against output schemas |
| `ai/schemas/` | 2 | Output JSON schemas (`roadmap_output.json`, etc.) |
| `ai/reference-materials/` | 1 | Reference material context for Prompt Builder |

---

## Security

- OpenAI API key: backend only, environment variable
- Frontend never calls OpenAI directly

## AI Request Logging (MVP)

Store basic log entries only:

| Field | Description |
|-------|-------------|
| `feature_type` | ROADMAP_GENERATION, WEEKLY_REPORT, or FINAL_SUMMARY |
| `requested_at` | Request timestamp |
| `status` | SUCCESS or FAILURE |
| `error_message` | Present when status is FAILURE |

Do **not** store full prompts or full AI responses in the MVP logging structure.

## Error Handling

- **Invalid JSON / schema validation failure:** retry generation once; on second failure, mark failed, return clear error to Mentor, do not save invalid output
- **API errors:** return error to Mentor, do not save partial invalid data
- **Timeouts (60 seconds):** cancel the request, mark generation failed, notify Mentor, allow manual retry only — do **not** automatically retry after timeout

## PDF Generation

Final summary PDFs use **ReportLab** (planned library, not implemented yet).

## Related Documentation

- [ai-features.md](ai-features.md) — feature inputs, outputs, and two-stage flow per feature
- [../ai/README.md](../ai/README.md) — module structure
