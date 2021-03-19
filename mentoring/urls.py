import json

from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.http import HttpResponse
import django.views.defaults

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

# as a last option, anything else (that's not api/) renders the frontend
urlpatterns.append(re_path('^(?!api/)', include('mentoring.frontend.urls')))

# ERROR HANDLING
#
# The below defines the special Django views handlerXXX so return a
# JSON-formatted error under `/api`, but fall back to the normal views in other
# cases.  Note that these views are not rendered in development mode
# (DEBUG=True).  Note, also, that the signature of handler500 is different from
# others, lacking the `exception` property.


def define_error_handler(detail, status_code, original, nargs=2):
    def handler(request, exception):
        if not request.path_info.startswith('/api'):
            if nargs == 1:
                return original(request)
            return original(request, exception)
        response = HttpResponse(
            json.dumps({"detail": detail}),
            content_type="application/json")
        response.status_code = status_code
        return response

    if nargs == 1:
        return lambda request: handler(request, None)
    return handler


handler400 = define_error_handler("Bad request.", 400, django.views.defaults.bad_request)
handler403 = define_error_handler("Permission denied.", 403, django.views.defaults.permission_denied)
handler404 = define_error_handler("Not found.", 404, django.views.defaults.page_not_found)
handler500 = define_error_handler("Internal server error.", 500, django.views.defaults.server_error, nargs=1)
