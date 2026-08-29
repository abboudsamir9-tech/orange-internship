from django.db import models

from apps.tasks.models import TaskAssignment
from common.validators import validate_upload_file


class Submission(models.Model):
    task_assignment = models.ForeignKey(
        TaskAssignment,
        on_delete=models.CASCADE,
        related_name="submissions",
    )
    version_number = models.PositiveIntegerField()
    written_response = models.TextField(blank=True)
    external_url = models.URLField(blank=True)
    intern_notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-version_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["task_assignment", "version_number"],
                name="unique_submission_version",
            )
        ]

    def __str__(self):
        return f"Submission v{self.version_number} for {self.task_assignment_id}"


class SubmissionFile(models.Model):
    submission = models.ForeignKey(
        Submission,
        on_delete=models.CASCADE,
        related_name="files",
    )
    file = models.FileField(
        upload_to="submission_files/",
        validators=[validate_upload_file],
    )
    original_file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["uploaded_at"]

    def __str__(self):
        return self.original_file_name

    def save(self, *args, **kwargs):
        if self.file:
            if not self.original_file_name:
                self.original_file_name = self.file.name
            if not self.file_size:
                self.file_size = self.file.size
        super().save(*args, **kwargs)
