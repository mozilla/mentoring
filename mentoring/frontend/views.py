import json
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
from django.middleware.csrf import get_token


# Check that a user is authenticated; this automatically redirects un-authenticated
# users to the SSO login page (and right back if auto-login is enabled)
@user_passes_test(lambda user: user.is_authenticated)
def root(request):
    return render(request, 'frontend/root.html', {})


# Pass some settings off to the browser for use in the UI
@user_passes_test(lambda user: user.is_authenticated)
def settings(request):
    user = request.user
    settings = {
        "csrftoken": get_token(request),
        "user": {
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,
        },
    }
    resp = HttpResponse(
        f'const MENTORING_SETTINGS = {json.dumps(settings, indent=4)};',
        content_type='application/javascript')
    resp['Content-Disposition'] = 'inline; filename="settings.js"'
    return resp
