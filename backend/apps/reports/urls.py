from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.reports.views import FinalInternshipSummaryViewSet, WeeklyReportViewSet

router = DefaultRouter()
router.register("weekly", WeeklyReportViewSet, basename="weekly-reports")
router.register("final-summaries", FinalInternshipSummaryViewSet, basename="final-summaries")

urlpatterns = [
    path("", include(router.urls)),
]
