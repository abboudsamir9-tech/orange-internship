from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from apps.submissions.models import Submission
from apps.submissions.serializers import SubmissionSerializer
from common.constants import Role


class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        user = self.request.user
        qs = Submission.objects.select_related(
            "task_assignment__intern__user",
            "task_assignment__task__program",
        ).prefetch_related("files")
        if user.role == Role.ADMIN:
            return qs
        if user.role == Role.MENTOR:
            return qs.filter(task_assignment__task__program__mentor=user)
        if user.role == Role.INTERN and hasattr(user, "intern_profile"):
            return qs.filter(task_assignment__intern=user.intern_profile)
        return qs.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != Role.INTERN or not hasattr(user, "intern_profile"):
            raise PermissionDenied("Only interns can submit work.")
        assignment = serializer.validated_data["task_assignment"]
        if assignment.intern_id != user.intern_profile.id:
            raise PermissionDenied("Not your task assignment.")
        serializer.save()
