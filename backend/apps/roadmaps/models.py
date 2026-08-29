from django.conf import settings
from django.db import models

from apps.programs.models import InternshipProgram, InternProfile
from common.constants import RoadmapScope, RoadmapStatus, Role


class Roadmap(models.Model):
    program = models.ForeignKey(
        InternshipProgram,
        on_delete=models.CASCADE,
        related_name="roadmaps",
    )
    title = models.CharField(max_length=255)
    summary = models.TextField(blank=True)
    assignment_scope = models.CharField(
        max_length=20,
        choices=RoadmapScope.CHOICES,
        default=RoadmapScope.PROGRAM,
    )
    number_of_weeks = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20,
        choices=RoadmapStatus.CHOICES,
        default=RoadmapStatus.DRAFT,
    )
    generated_by_ai = models.BooleanField(default=False)
    assigned_interns = models.ManyToManyField(
        InternProfile,
        blank=True,
        related_name="roadmaps",
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_roadmaps",
        limit_choices_to={"role": Role.MENTOR},
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class RoadmapWeek(models.Model):
    roadmap = models.ForeignKey(
        Roadmap,
        on_delete=models.CASCADE,
        related_name="weeks",
    )
    week_number = models.PositiveIntegerField()
    weekly_focus = models.CharField(max_length=255)
    learning_objectives = models.JSONField(default=list, blank=True)
    expected_skills_gained = models.JSONField(default=list, blank=True)
    mentor_notes = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "week_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["roadmap", "week_number"],
                name="unique_roadmap_week_number",
            )
        ]

    def __str__(self):
        return f"{self.roadmap.title} · Week {self.week_number}"
