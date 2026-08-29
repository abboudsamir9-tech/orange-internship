from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.programs.models import InternshipProgram, InternProfile
from apps.roadmaps.models import RoadmapWeek
from common.constants import (
    RequirementType,
    ResourceType,
    TaskAssignmentStatus,
    TaskDifficulty,
    TaskSource,
)
from common.validators import validate_score, validate_upload_file


class Task(models.Model):
    roadmap_week = models.ForeignKey(
        RoadmapWeek,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks",
    )
    program = models.ForeignKey(
        InternshipProgram,
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_tasks",
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=TaskDifficulty.CHOICES)
    estimated_time_minutes = models.PositiveIntegerField()
    deliverable = models.TextField(blank=True)
    success_criteria = models.TextField(blank=True)
    due_date = models.DateField()
    requirement_type = models.CharField(
        max_length=20,
        choices=RequirementType.CHOICES,
        default=RequirementType.REQUIRED,
    )
    source = models.CharField(
        max_length=20,
        choices=TaskSource.CHOICES,
        default=TaskSource.MANUAL,
    )
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "due_date", "title"]

    def __str__(self):
        return self.title


class TaskResource(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="resources",
    )
    title = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=20, choices=ResourceType.CHOICES)
    file = models.FileField(
        upload_to="task_resources/",
        blank=True,
        null=True,
        validators=[validate_upload_file],
    )
    external_url = models.URLField(blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "title"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.file and not self.file_size:
            self.file_size = self.file.size
        super().save(*args, **kwargs)


class TaskAssignment(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="assignments",
    )
    intern = models.ForeignKey(
        InternProfile,
        on_delete=models.CASCADE,
        related_name="task_assignments",
    )
    status = models.CharField(
        max_length=20,
        choices=TaskAssignmentStatus.CHOICES,
        default=TaskAssignmentStatus.TO_DO,
    )
    due_date_override = models.DateField(null=True, blank=True)
    score = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    mentor_feedback = models.TextField(blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-assigned_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["task", "intern"],
                name="unique_task_intern_assignment",
            )
        ]

    def __str__(self):
        return f"{self.task.title} → {self.intern.user.full_name}"

    @property
    def effective_due_date(self):
        return self.due_date_override or self.task.due_date

    def clean(self):
        validate_score(self.score)
