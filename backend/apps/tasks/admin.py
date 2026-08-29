from django.contrib import admin

from apps.tasks.models import Task, TaskAssignment, TaskResource


class TaskResourceInline(admin.TabularInline):
    model = TaskResource
    extra = 0


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "program", "difficulty", "due_date", "requirement_type", "source")
    list_filter = ("difficulty", "requirement_type", "source")
    search_fields = ("title", "program__title")
    inlines = [TaskResourceInline]


@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ("task", "intern", "status", "score", "due_date_override")
    list_filter = ("status",)
    search_fields = ("task__title", "intern__user__full_name")
