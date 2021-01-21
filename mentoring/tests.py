import string

from django.test import TestCase

from .auth import MentoringAuthBackend


class Auth(TestCase):

    def get_username(self):
        'Verify that get_username always generates valid Django usernames'
        django_allowed = string.ascii_letters + string.digits + '_@+.-'
        for oidc_username in string.printable:
            username = MentoringAuthBackend().get_username({'sub': oidc_username})
            if c in django_allowed:
                self.assertEqual(username, oidc_username)
            else:
                self.assertNotEqual(username, oidc_username)
            for c in oidc_username:
                assert c in django_allowed
