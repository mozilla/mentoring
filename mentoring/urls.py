from django.conf import settings
from django.contrib import admin
from django.urls import include, path

from . import rest

urlpatterns = [
    # the API
    path('api/', include(rest.router.urls)),
    # oidc authentication
    path('oidc/', include('mozilla_django_oidc.urls')),

]

# if (and only if) we are in DEBUG mode (meaning Development), we allow
# users to sign in using simple Django auth, and access the admin panel
if settings.DEBUG:
    urlpatterns.extend([
        path('accounts/', include('django.contrib.auth.urls')),
        path('admin/', admin.site.urls),
    ])

# as a last option, anything else renders the frontend
urlpatterns.append(path('', include('mentoring.frontend.urls')))
