from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from common.constants import ProgramStatus, ResourceType, Role, SkillLevel
from common.validators import validate_upload_file


class InternshipProgram(models.Model):
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="programs",
        limit_choices_to={"role": Role.MENTOR},
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    role = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    duration_weeks = models.PositiveIntegerField()
    department = models.CharField(max_length=255)
    weekly_hours = models.PositiveIntegerField()
    maximum_interns = models.PositiveIntegerField()
    skills_needed = models.JSONField(default=list, blank=True)
    skills_to_develop = models.JSONField(default=list, blank=True)
    goals = models.TextField(blank=True)
    expected_outcome = models.TextField(blank=True)
    final_project = models.TextField(blank=True)
    additional_instructions = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=ProgramStatus.CHOICES,
        default=ProgramStatus.DRAFT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date", "title"]

    def __str__(self):
        return self.title


class InternProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="intern_profile",
        limit_choices_to={"role": Role.INTERN},
    )
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="assigned_interns",
        limit_choices_to={"role": Role.MENTOR},
    )
    program = models.ForeignKey(
        InternshipProgram,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="interns",
    )
    major = models.CharField(max_length=255, blank=True)
    university = models.CharField(max_length=255, blank=True)
    learning_goals = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["user__full_name"]

    def __str__(self):
        return f"InternProfile<{self.user.full_name}>"


class InternSkill(models.Model):
    intern = models.ForeignKey(
        InternProfile,
        on_delete=models.CASCADE,
        related_name="skills",
    )
    skill_name = models.CharField(max_length=100)
    skill_level = models.PositiveSmallIntegerField(
        choices=SkillLevel.CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["skill_name"]
        constraints = [
            models.UniqueConstraint(
                fields=["intern", "skill_name"],
                name="unique_intern_skill_name",
            )
        ]

    def __str__(self):
        return f"{self.skill_name} ({self.skill_level})"


class ProgramReferenceMaterial(models.Model):
    program = models.ForeignKey(
        InternshipProgram,
        on_delete=models.CASCADE,
        related_name="reference_materials",
    )
    title = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=20, choices=ResourceType.CHOICES)
    file = models.FileField(
        upload_to="program_materials/",
        blank=True,
        null=True,
        validators=[validate_upload_file],
    )
    external_url = models.URLField(blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.file and not self.file_size:
            self.file_size = self.file.size
        super().save(*args, **kwargs)
