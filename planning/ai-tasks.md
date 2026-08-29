# AI Tasks

> **Status:** Planning only. Not started.

See [backlog.md](backlog.md) for the full list.

All features use **Stage 1 (Prompt Builder) → Stage 2 (Generator + Validator) → Draft**.

## Integration
- OpenAI SDK integration in Django (generators/)
- Environment variable for API key
- Basic AI request logging (feature type, timestamp, success/failure, error message only)

## Stage 1 — Prompt Builders
- `prompt_builder/roadmap_prompt_builder.py` — assemble roadmap context; use `prompts/roadmap_template.md`
- `prompt_builder/weekly_report_prompt_builder.py` — assemble weekly performance context
- `prompt_builder/final_summary_prompt_builder.py` — assemble intern program history context
- Include reference materials in roadmap Prompt Builder context
- Prompt Builder must not invent requirements or unapproved features

## Stage 2 — Generators
- `generators/roadmap_generator.py` — send optimized prompt to OpenAI; full multi-week output
- `generators/weekly_report_generator.py` — manual Mentor trigger only
- `generators/final_summary_generator.py` — manual Mentor trigger

## Validators
- `validators/roadmap_validator.py` — validate against `schemas/roadmap_output.json`
- `validators/weekly_report_validator.py` — validate against `schemas/weekly_report_output.json`
- `validators/final_summary_validator.py` — validate against `schemas/final_summary_output.json`

## Error Handling
- Invalid JSON: retry generation once; second failure marks failed, shows Mentor error, does not save invalid output
- Timeout (60 seconds): cancel request, mark failed, notify Mentor, manual retry only — no automatic retry

## Reference Materials
- Include ReferenceMaterial records in roadmap Prompt Builder context
- File parsing not in MVP scaffolding scope
