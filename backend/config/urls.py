from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls_auth")),
    path("api/accounts/", include("apps.accounts.urls")),
    path("api/programs/", include("apps.programs.urls")),
    path("api/roadmaps/", include("apps.roadmaps.urls")),
    path("api/tasks/", include("apps.tasks.urls")),
    path("api/submissions/", include("apps.submissions.urls")),
    path("api/reports/", include("apps.reports.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
