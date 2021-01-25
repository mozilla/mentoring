import pytz
import datetime

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Pair, HistoricalPair
from ..participants.models import Participant


class PairTest(TestCase):

    def make_particips(self):
        learner = Participant(
            expires=datetime.datetime.now(pytz.UTC),
            email='llearner@mozilla.com',
            is_learner=True,
            is_mentor=False,
            full_name='Logan Learner',
            manager='Mani Shur',
            manager_email='mshur@mozilla.com',
            time_availability='N' * 24,
        )
        learner.save()

        mentor = Participant(
            expires=datetime.datetime.now(pytz.UTC),
            email='mmentor@mozilla.com',
            is_learner=False,
            is_mentor=True,
            full_name='Murphy Mentor',
            manager='Mani Shur',
            manager_email='mshur@mozilla.com',
            time_availability='N' * 24,
        )
        mentor.save()

        return learner, mentor

    def test_model_make_pair(self):
        learner, mentor = self.make_particips()
        p = Pair(learner=learner, mentor=mentor)
        p.save()

        self.assertEqual(p.learner.email, 'llearner@mozilla.com')
        self.assertEqual(p.mentor.email, 'mmentor@mozilla.com')
        self.assertEqual(
            p.pair_id(),
            '7cad7224883ae75c7da6fa77a35be39df0f9f9003750ce3c5363dc0ff5f12865')

        self.assertFalse(HistoricalPair.already_paired(p))

        HistoricalPair.record_pairing(p)

        self.assertTrue(HistoricalPair.already_paired(p))

    def test_make_pair_rest(self):
        learner, mentor = self.make_particips()

        client = APIClient()
        user = User.objects.create_superuser('test')
        user.save()
        client.force_authenticate(user=user)
        res = client.post(
            '/api/pairs',
            {'learner': learner.id, 'mentor': mentor.id},
            format='json')
        self.assertEqual(res.status_code, 201)

        pair = Pair.objects.get()
        self.assertEqual(pair.mentor.id, mentor.id)
        self.assertEqual(pair.learner.id, learner.id)

    def test_make_pair_rest_mentor_as_learner(self):
        learner, mentor = self.make_particips()

        client = APIClient()
        user = User.objects.create_superuser('test')
        user.save()
        client.force_authenticate(user=user)
        res = client.post(
            '/api/pairs',
            # note that these are reversed
            {'mentor': learner.id, 'learner': mentor.id},
            format='json')
        self.assertEqual(res.status_code, 400)
