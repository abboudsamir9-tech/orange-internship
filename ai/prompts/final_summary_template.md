# Final Summary Prompt Template

## Purpose

Base template used by `prompt_builder/final_summary_prompt_builder.py` to construct the optimized prompt. This file is **not** sent directly to the LLM.

## Context Variables (assembled by Prompt Builder)

- Intern program history
- Initial roadmap, weekly performance reports
- Tasks nested under each roadmap week (`weeks_and_tasks`)
- Submissions, scores, mentor feedback
- Skills developed, final project (if applicable)

## Prompt Builder Output

One clear, structured, optimized prompt. Must not include hiring recommendations.

## LLM Output Schema

Structured JSON matching `schemas/final_summary_output.json`, including:

- `introduction` — formal introductory evaluation of overall placement
- `training_summary` — core learnings, performance, and skill progression
- Existing narrative fields (`overall_performance_summary`, `learning_journey`, `main_achievements`, `goal_achievement`, `final_performance_summary`)
- `weeks_and_tasks` — every internship week with associated tasks
