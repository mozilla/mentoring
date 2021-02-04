import pytz
import datetime

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Participant
from .rest import ParticipantSerializer


def make_particip(no_save=False):
    particip = Participant(
        expires=datetime.datetime.now(pytz.UTC),
        email='llearner@mozilla.com',
        is_learner=True,
        is_mentor=False,
        full_name='Logan Learner',
        manager='Mani Shur',
        manager_email='mshur@mozilla.com',
        time_availability='N' * 24,
    )
    if not no_save:
        particip.save()
    return particip


def login(client, email, admin=False):
    if admin:
        user = User.objects.create_superuser('particip', email=email)
    else:
        user = User.objects.create_user('particip', email=email)
    user.save()
    client.force_authenticate(user=user)


class ParticipantTestAnonumous(TestCase):

    def test_api_list_anonymous(self):
        particip = make_particip()
        client = APIClient()
        res = client.get('/api/participants')
        self.assertEqual(res.status_code, 403)

    def test_api_get_anonymous(self):
        particip = make_particip()
        client = APIClient()
        res = client.get(f'/api/participants/{particip.id}')
        self.assertEqual(res.status_code, 403)

    def test_api_get_by_email_anonymous(self):
        particip = make_particip()
        client = APIClient()
        res = client.get(f'/api/participants/by_email?email={particip.email}')
        self.assertEqual(res.status_code, 403)


class ParticipantTestRegularUser(TestCase):

    def test_api_list_user(self):
        particip = make_particip()
        client = APIClient()
        login(client, particip.email)
        res = client.get('/api/participants')
        self.assertEqual(res.status_code, 403)

    def test_api_get_user_not_self(self):
        particip = make_particip()
        client = APIClient()
        login(client, 'someone-else@mozilla.com')
        res = client.get(f'/api/participants/{particip.id}')
        self.assertEqual(res.status_code, 403)

    def test_api_get_user_self(self):
        particip = make_particip()
        client = APIClient()
        login(client, particip.email)
        res = client.get(f'/api/participants/{particip.id}')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['email'], particip.email)

    def test_api_get_user_by_email_not_self(self):
        particip = make_particip()
        client = APIClient()
        login(client, 'someone-else@mozilla.com')
        res = client.get(f'/api/participants/by_email?email={particip.email}')
        self.assertEqual(res.status_code, 403)

    def test_api_get_user_by_email_self(self):
        particip = make_particip()
        client = APIClient()
        login(client, particip.email)
        res = client.get(f'/api/participants/by_email?email={particip.email}')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['email'], particip.email)

    def test_api_update_user_not_self(self):
        particip = make_particip()
        client = APIClient()
        login(client, 'someone-else@mozilla.com')
        res = client.put(
            f'/api/participants/{particip.id}',
            {})
        self.assertEqual(res.status_code, 403)

    def test_api_update_user_self(self):
        particip = make_particip()
        particip_json = ParticipantSerializer(particip).data
        particip_json['full_name'] = 'UPDATED'
        client = APIClient()
        login(client, particip.email)
        res = client.put(
            f'/api/participants/{particip.id}',
            particip_json,
            format='json')
        self.assertEqual(res.status_code, 200)
        res = client.get(f'/api/participants/{particip.id}')
        self.assertEqual(res.json()['full_name'], 'UPDATED')

    def test_api_partial_update_user_self(self):
        particip = make_particip()
        client = APIClient()
        login(client, particip.email)
        res = client.patch(
            f'/api/participants/{particip.id}',
            {'full_name': 'UPDATED'},
            format='json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["full_name"], "UPDATED")

    def test_api_update_user_self_change_email(self):
        particip = make_particip()
        particip_json = ParticipantSerializer(particip).data
        particip_json['email'] = 'UPDATED@mozilla.com'
        client = APIClient()
        login(client, particip.email)
        res = client.put(
            f'/api/participants/{particip.id}',
            particip_json,
            format='json')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json(), {"email": ["email field must match your own email"]})

    def test_api_partial_update_user_self_change_email(self):
        particip = make_particip()
        client = APIClient()
        login(client, particip.email)
        res = client.patch(
            f'/api/participants/{particip.id}',
            {'email': 'UPDATED@mozilla.com'},
            format='json')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json(), {"email": ["email field must match your own email"]})

    def test_api_create_user_self(self):
        particip = make_particip(no_save=True)
        particip_json = ParticipantSerializer(particip).data
        client = APIClient()
        login(client, particip.email)
        res = client.post(
            '/api/participants',
            particip_json,
            format='json')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.json()['email'], particip.email)

    def test_api_create_user_not_self(self):
        particip = make_particip(no_save=True)
        particip_json = ParticipantSerializer(particip).data
        client = APIClient()
        login(client, 'someone-else@mozilla.com')
        res = client.post(
            '/api/participants',
            particip_json,
            format='json')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json(), {"email": ["email field must match your own email"]})


class ParticipantTestAdminUser(TestCase):

    def test_api_list_admin(self):
        particip = make_particip()
        client = APIClient()
        login(client, particip.email, admin=True)
        res = client.get('/api/participants')
        self.assertEqual(res.status_code, 200)
        self.assertEqual([r['email'] for r in res.json()], [particip.email])

    def test_api_get_admin(self):
        particip = make_particip()
        client = APIClient()
        login(client, particip.email, admin=True)
        res = client.get(f'/api/participants/{particip.id}')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['email'], particip.email)

    def test_api_get_by_email_admin(self):
        particip = make_particip()
        client = APIClient()
        login(client, particip.email, admin=True)
        res = client.get(f'/api/participants/by_email?email={particip.email}')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['email'], particip.email)
