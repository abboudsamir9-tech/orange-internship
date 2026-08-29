from django.contrib import admin

from apps.programs.models import (
    InternProfile,
    InternSkill,
    InternshipProgram,
    ProgramReferenceMaterial,
)


class InternSkillInline(admin.TabularInline):
    model = InternSkill
    extra = 0


@admin.register(InternshipProgram)
class InternshipProgramAdmin(admin.ModelAdmin):
    list_display = ("title", "mentor", "department", "status", "start_date", "end_date")
    list_filter = ("status", "department")
    search_fields = ("title", "role", "mentor__full_name")


@admin.register(InternProfile)
class InternProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "mentor", "program", "university", "major")
    search_fields = ("user__full_name", "university", "major")
    list_filter = ("mentor",)
    inlines = [InternSkillInline]


@admin.register(ProgramReferenceMaterial)
class ProgramReferenceMaterialAdmin(admin.ModelAdmin):
    list_display = ("title", "program", "resource_type")
    list_filter = ("resource_type",)
    search_fields = ("title", "program__title")
