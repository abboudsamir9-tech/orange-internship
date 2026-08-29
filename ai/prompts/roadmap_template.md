# Roadmap Prompt Template

> **Status:** Placeholder only. Not implemented.

## Purpose

Base template used by `prompt_builder/roadmap_prompt_builder.py` to construct the optimized prompt. This file is **not** sent directly to the LLM.

## Context Variables (assembled by Prompt Builder)

- Program information (title, description, role, dates, duration, goals, skills, outcomes, final project)
- Roadmap scope (PROGRAM, GROUP, INDIVIDUAL)
- Assigned intern(s) when applicable
- Skills and skill levels (1–5)
- Learning goals and preferences
- Weekly hours, department, expected outcome, additional instructions
- Reference materials (when available)

## Prompt Builder Output

One clear, structured, optimized prompt that:

- Includes all relevant context
- Follows business rules and respects roadmap scope
- Includes reference materials where applicable
- Never invents requirements or unapproved features

## LLM Output Schema

Structured JSON matching `schemas/roadmap_output.json`.
