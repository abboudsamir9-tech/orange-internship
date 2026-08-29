from django.contrib import admin

from apps.submissions.models import Submission, SubmissionFile


class SubmissionFileInline(admin.TabularInline):
    model = SubmissionFile
    extra = 0


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("task_assignment", "version_number", "submitted_at")
    search_fields = ("task_assignment__task__title", "task_assignment__intern__user__full_name")
    inlines = [SubmissionFileInline]
