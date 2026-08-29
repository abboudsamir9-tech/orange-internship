from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from apps.accounts.models import MentorProfile, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("email",)
    list_display = ("email", "username", "full_name", "role", "is_active", "date_joined")
    list_filter = ("role", "is_active")
    search_fields = ("email", "username", "full_name")
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Profile", {"fields": ("full_name", "phone_number", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("date_joined", "last_login")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "full_name",
                    "role",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )
    filter_horizontal = ("groups", "user_permissions")


@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "department", "job_title")
    search_fields = ("user__full_name", "department", "job_title")
