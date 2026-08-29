from django.db.models import Avg

from apps.tasks.models import TaskAssignment


def calculate_overall_weekly_score(intern_profile, roadmap_week):
    """Average of scored TaskAssignments for intern in a given RoadmapWeek."""
    if roadmap_week is None:
        return None

    qs = TaskAssignment.objects.filter(
        intern=intern_profile,
        task__roadmap_week=roadmap_week,
        score__isnull=False,
    )
    if not qs.exists():
        return None
    avg = qs.aggregate(value=Avg("score"))["value"]
    if avg is None:
        return None
    return int(round(avg))


def refresh_weekly_report_score(weekly_report):
    weekly_report.overall_weekly_score = calculate_overall_weekly_score(
        weekly_report.intern,
        weekly_report.roadmap_week,
    )
    weekly_report.save(update_fields=["overall_weekly_score", "updated_at"])
    return weekly_report.overall_weekly_score
