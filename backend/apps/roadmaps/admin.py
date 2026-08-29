from django.contrib import admin

from apps.roadmaps.models import Roadmap, RoadmapWeek


class RoadmapWeekInline(admin.TabularInline):
    model = RoadmapWeek
    extra = 0


@admin.register(Roadmap)
class RoadmapAdmin(admin.ModelAdmin):
    list_display = ("title", "program", "assignment_scope", "status", "number_of_weeks")
    list_filter = ("status", "assignment_scope")
    search_fields = ("title", "program__title")
    inlines = [RoadmapWeekInline]
    filter_horizontal = ("assigned_interns",)
