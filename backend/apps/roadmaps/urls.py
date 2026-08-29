from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.roadmaps.views import RoadmapViewSet, RoadmapWeekViewSet

router = DefaultRouter()
router.register("weeks", RoadmapWeekViewSet, basename="roadmap-weeks")
router.register("", RoadmapViewSet, basename="roadmaps")

urlpatterns = [
    path("", include(router.urls)),
]
