from rest_framework.permissions import BasePermission

from common.constants import Role


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.ADMIN
        )


class IsMentor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.MENTOR
        )


class IsIntern(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.INTERN
        )


class IsAdminOrMentor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in {Role.ADMIN, Role.MENTOR}
        )


class IsAdminOrReadOnlyMentor(BasePermission):
    """Admin can read; mentors can write their own resources (object-level elsewhere)."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == Role.ADMIN:
            return request.method in ("GET", "HEAD", "OPTIONS")
        return request.user.role == Role.MENTOR
