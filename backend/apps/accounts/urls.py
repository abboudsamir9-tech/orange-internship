from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.accounts.views import (
    InternCreateView,
    InternListView,
    MentorCreateView,
    MentorListView,
    UserViewSet,
)

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
    path("mentors/", MentorListView.as_view(), name="mentors-list"),
    path("mentors/create/", MentorCreateView.as_view(), name="mentors-create"),
    path("interns/", InternListView.as_view(), name="interns-list"),
    path("interns/create/", InternCreateView.as_view(), name="interns-create"),
]
