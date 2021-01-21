from django.conf import settings
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
    # oidc authentication
    path('oidc/', include('mozilla_django_oidc.urls')),

    # if (and only if) we are in DEBUG mode (meaning Development), we allow
    # users to sign in using simple Django auth
] + ([path('accounts/', include('django.contrib.auth.urls'))] if settings.DEBUG else []) + [

    # ..and anything else renders the frontend
    path('', include('mentoring.frontend.urls')),
]
