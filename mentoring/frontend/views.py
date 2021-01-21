from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test


# Check that a user is authenticated; this automatically redirects un-authenticated
# users to the SSO login page (and right back if auto-login is enabled)
@user_passes_test(lambda user: user.is_authenticated)
def root(request):
    return render(request, 'frontend/root.html', {})
