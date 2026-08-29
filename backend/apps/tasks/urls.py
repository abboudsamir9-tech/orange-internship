from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.tasks.views import TaskAssignmentViewSet, TaskResourceViewSet, TaskViewSet

router = DefaultRouter()
router.register("resources", TaskResourceViewSet, basename="task-resources")
router.register("assignments", TaskAssignmentViewSet, basename="task-assignments")
router.register("", TaskViewSet, basename="tasks")

urlpatterns = [
    path("", include(router.urls)),
]
