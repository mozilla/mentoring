import pytz
import datetime

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Pair, HistoricalPair
from ..participants.models import Participant

class PairTest(TestCase):

    def make_particips(self):
        l = Participant(
            expires=datetime.datetime.now(pytz.UTC),
            email='llearner@mozilla.com',
            role=Participant.LEARNER,
            full_name='Logan Learner',
            manager='Mani Shur',
            manager_email='mshur@mozilla.com',
            time_availability='N' * 24,
        )
        l.save()

        m = Participant(
            expires=datetime.datetime.now(pytz.UTC),
            email='mmentor@mozilla.com',
            role=Participant.MENTOR,
            full_name='Murphy Mentor',
            manager='Mani Shur',
            manager_email='mshur@mozilla.com',
            time_availability='N' * 24,
        )
        m.save()

        return l, m

    def test_model_make_pair(self):
        l, m = self.make_particips()
        p = Pair(learner=l, mentor=m)
        p.save()

        self.assertEqual(p.learner.email, 'llearner@mozilla.com')
        self.assertEqual(p.mentor.email, 'mmentor@mozilla.com')
        self.assertEqual(
            p.pair_id(),
            'c872ad8e357ba35a27e54728ea72c49d75eb83a858ccb9b0fc4d7c30949eca11')

        self.assertFalse(HistoricalPair.already_paired(p))

        HistoricalPair.record_pairing(p)

        self.assertTrue(HistoricalPair.already_paired(p))

    def test_make_pair_rest_mentor_as_learner(self):
        l, m = self.make_particips()

        client = APIClient()
        user = User.objects.create_superuser('test')
        user.save()
        client.force_authenticate(user=user)
        res = client.post(
            '/api/pairs',
            # note that these are reversed
            {'mentor': l.id, 'learner': m.id},
            format='json')
        self.assertEqual(res.status_code, 400)
