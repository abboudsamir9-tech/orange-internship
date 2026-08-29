# Weekly Report Prompt Template

> **Status:** Placeholder only. Not implemented.

## Purpose

Base template used by `prompt_builder/weekly_report_prompt_builder.py` to construct the optimized prompt. This file is **not** sent directly to the LLM.

## Context Variables (assembled by Prompt Builder)

- Intern and week number
- Planned weekly objectives
- Assigned, completed, and incomplete tasks
- Task completion rate, submission history, scores (0–100)
- Mentor feedback, missed and overdue deadlines

## Prompt Builder Output

One clear, structured, optimized prompt for weekly performance analysis.

## LLM Output Schema

Structured JSON matching `schemas/weekly_report_output.json`.
