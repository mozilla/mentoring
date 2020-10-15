from django.contrib import admin
from django.urls import include, path

from . import rest

urlpatterns = [
    # the POST destination for enrollment via SurveyGizmo
    path('enrollment/', include('mentoring.enrollment.urls')),
    # the Django admin
    path('admin/', admin.site.urls),
    # the API
    path('api/', include(rest.router.urls)),
    # ..and anything else renders the frontend
    path('', include('mentoring.frontend.urls')),
]
