# Final Summary Prompt Template

> **Status:** Placeholder only. Not implemented.

## Purpose

Base template used by `prompt_builder/final_summary_prompt_builder.py` to construct the optimized prompt. This file is **not** sent directly to the LLM.

## Context Variables (assembled by Prompt Builder)

- Intern program history
- Initial roadmap, weekly performance reports
- Tasks, submissions, scores, mentor feedback
- Skills developed, final project (if applicable)

## Prompt Builder Output

One clear, structured, optimized prompt. Must not include hiring recommendations.

## LLM Output Schema

Structured JSON matching `schemas/final_summary_output.json`.
