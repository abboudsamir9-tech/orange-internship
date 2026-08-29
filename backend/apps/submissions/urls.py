from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.submissions.views import SubmissionViewSet

router = DefaultRouter()
router.register("", SubmissionViewSet, basename="submissions")

urlpatterns = [
    path("", include(router.urls)),
]
