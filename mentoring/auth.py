from django.conf import settings
from mozilla_django_oidc.auth import OIDCAuthenticationBackend
import urllib.parse


class MentoringAuthBackend(OIDCAuthenticationBackend):
    """
    Customization of the connection between OIDC and Django.

    https://mozilla-django-oidc.readthedocs.io/en/stable/installation.html#additional-optional-configuration
    """

    def get_username(self, claims):
        """
        Use the OIDC `sub` claim as the username, as it is guaranteed to be
        unique and not change.  It is escaped using a format similar to
        urlencoding, to the Django requirement "alphanumeric, _, @, +, . and -
        characters".
        """
        return urllib.parse.quote(claims['sub'], safe='').replace('%', '@')

    def create_user(self, claims):
        """
        Set custom user properties based on OIDC claims
        """
        user = super(MentoringAuthBackend, self).create_user(claims)
        return self.update_user(user, claims)

    def update_user(self, user, claims):
        """
        Update first_name, last_name, and is_admin on a user, based
        on oidc profile claims.
        """
        user.first_name = claims.get('given_name', '')
        user.email = claims.get('email', '')
        user.last_name = claims.get('family_name', '')

        groups = claims.get("https://sso.mozilla.com/claim/groups", [])
        user.is_staff = any(x in groups for x in settings.STAFF_GROUPS)

        user.save()

        return user
