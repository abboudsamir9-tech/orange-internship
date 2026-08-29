from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.programs.views import (
    InternshipProgramViewSet,
    ProgramAnalyticsExportExcelView,
    ProgramAnalyticsExportPdfView,
    ProgramAnalyticsView,
    ProgramReferenceMaterialViewSet,
)

router = DefaultRouter()
router.register("", InternshipProgramViewSet, basename="programs")
router.register("materials/items", ProgramReferenceMaterialViewSet, basename="program-materials")

urlpatterns = [
    path("analytics/", ProgramAnalyticsView.as_view(), name="program-analytics"),
    path(
        "analytics/export/excel/",
        ProgramAnalyticsExportExcelView.as_view(),
        name="program-analytics-excel",
    ),
    path(
        "analytics/export/pdf/",
        ProgramAnalyticsExportPdfView.as_view(),
        name="program-analytics-pdf",
    ),
    path("", include(router.urls)),
]
