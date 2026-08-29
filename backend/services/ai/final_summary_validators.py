"""Validate AI Final Summary structured output before persistence."""

from __future__ import annotations

from services.ai.exceptions import AIInvalidOutputError
from services.ai.schemas import GeneratedFinalSummary, GeneratedFinalSummaryWeek

REQUIRED_TEXT_FIELDS = (
    "introduction",
    "training_summary",
    "overall_performance_summary",
    "learning_journey",
    "main_achievements",
    "goal_achievement",
    "final_performance_summary",
)

MAX_FIELD_CHARS = 8000
MIN_FIELD_CHARS = 20


def validate_generated_final_summary(
    summary: GeneratedFinalSummary,
) -> GeneratedFinalSummary:
    data = summary.model_dump()
    for field in REQUIRED_TEXT_FIELDS:
        value = data.get(field)
        if not isinstance(value, str):
            raise AIInvalidOutputError(
                "AI final summary generation could not produce a valid summary. Please try again."
            )
        cleaned = value.strip()
        if len(cleaned) < MIN_FIELD_CHARS:
            raise AIInvalidOutputError(
                "AI final summary generation could not produce a valid summary. Please try again."
            )
        if len(cleaned) > MAX_FIELD_CHARS:
            raise AIInvalidOutputError(
                "AI final summary generation could not produce a valid summary. Please try again."
            )
        setattr(summary, field, cleaned)

    weeks = data.get("weeks_and_tasks")
    if not isinstance(weeks, list):
        raise AIInvalidOutputError(
            "AI final summary generation could not produce a valid summary. Please try again."
        )

    cleaned_weeks: list[GeneratedFinalSummaryWeek] = []
    seen_weeks: set[int] = set()
    for week in weeks:
        if not isinstance(week, dict):
            raise AIInvalidOutputError(
                "AI final summary generation could not produce a valid summary. Please try again."
            )
        week_number = week.get("week_number")
        if not isinstance(week_number, int) or week_number < 1:
            raise AIInvalidOutputError(
                "AI final summary generation could not produce a valid summary. Please try again."
            )
        if week_number in seen_weeks:
            raise AIInvalidOutputError(
                "AI final summary generation could not produce a valid summary. Please try again."
            )
        seen_weeks.add(week_number)

        tasks = week.get("tasks") or []
        if not isinstance(tasks, list):
            raise AIInvalidOutputError(
                "AI final summary generation could not produce a valid summary. Please try again."
            )
        cleaned_tasks = []
        for task in tasks:
            if not isinstance(task, dict):
                raise AIInvalidOutputError(
                    "AI final summary generation could not produce a valid summary. Please try again."
                )
            title = str(task.get("title") or "").strip()
            if not title:
                raise AIInvalidOutputError(
                    "AI final summary generation could not produce a valid summary. Please try again."
                )
            cleaned_tasks.append(
                {
                    "title": title,
                    "status": str(task.get("status") or "").strip(),
                    "is_completed": bool(task.get("is_completed")),
                    "requirement_type": str(task.get("requirement_type") or "").strip(),
                    "score": task.get("score") if isinstance(task.get("score"), int) else None,
                }
            )

        cleaned_weeks.append(
            GeneratedFinalSummaryWeek(
                week_number=week_number,
                weekly_focus=str(week.get("weekly_focus") or "").strip(),
                tasks=cleaned_tasks,
            )
        )

    summary.weeks_and_tasks = cleaned_weeks

    forbidden = {
        "final_score",
        "mentor_comments",
        "additional_notes",
        "additional_mentor_notes",
        "status",
        "strengths",
        "areas_for_improvement",
        "hiring_recommendation",
    }
    allowed = set(REQUIRED_TEXT_FIELDS) | {"weeks_and_tasks"}
    extras = set(data.keys()) - allowed
    if extras & forbidden:
        raise AIInvalidOutputError(
            "AI final summary generation could not produce a valid summary. Please try again."
        )
    return summary
