import pytz
import datetime
from urllib.parse import urlencode

from django.test import TestCase
from django.test import Client

from ..participants.models import Participant
from .views import time_availability


class TimeAvailabilityTest(TestCase):

    def test_no_avail(self):
        self.assertEqual(time_availability([]), 'NNNNNNNNNNNNNNNNNNNNNNNN')

    def test_one_avail(self):
        self.assertEqual(time_availability(['00:00 - 03:00 UTC']), 'YYYNNNNNNNNNNNNNNNNNNNNN')

    def test_end_of_day_avail(self):
        self.assertEqual(time_availability(['21:00 - 00:00 UTC']), 'NNNNNNNNNNNNNNNNNNNNNYYY')


class PostTest(TestCase):
    def setUp(self):
        self.client = Client()

    def make_post(self, overrides):
        payload = {
            'full_name': 'Alex Doe',
            'email': 'adoe@mozilla.com',
            'manager': 'Mana Jerr',
            'manager_email': 'mjerr@mozilla.com',
            'org_level': 'P3',
            'time_at_org_level': '1-2 y',
            'org': 'Firefox',
            'track_change': '',
            'org_chart_distance': '',
            'comments': '',
            'Question_SKU': '39',
            'Language': 'English',
        }
        payload.update(overrides)
        return self.client.post(
            '/enrollment/hook',
            urlencode(payload),
            content_type='application/x-www-form-urlencoded')

    def test_post_mentor_and_learner(self):
        response = self.make_post({
            'role[0]': 'M',
            'role[1]': 'L',
            'time_availability[0]': '00:00 - 03:00 UTC',
            'time_availability[1]': '03:00 - 06:00 UTC',
            'time_availability[2]': '09:00 - 12:00 UTC',
            'mentor_interests[0]': 'Increasing Impact on Mozilla Mission',
            'mentor_interests[1]': 'Public Speaking',
            'learner_interests[0]': 'Technical Leadership',
            'track_change': 'Maybe',
            'org_chart_distance': 'Prefer distant',
            'comments': 'asdf',
        })

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)

        for (p, role) in [
            (Participant.objects.get(email='adoe@mozilla.com', role=Participant.MENTOR), Participant.MENTOR),
            (Participant.objects.get(email='adoe@mozilla.com', role=Participant.LEARNER), Participant.LEARNER),
        ]:
            assert(p.expires > datetime.datetime.now(tz=pytz.UTC))
            assert(p.email == 'adoe@mozilla.com')
            assert(p.role == role)
            assert(p.full_name == 'Alex Doe')
            assert(p.manager == 'Mana Jerr')
            assert(p.manager_email == 'mjerr@mozilla.com')
            assert(p.approved is None)
            assert(p.time_availability == 'YYYYYYNNNYYYNNNNNNNNNNNN')
            assert(p.org == 'Firefox')
            assert(p.org_level == 'P3')
            assert(p.time_at_org_level == '1-2 y')
            if role == Participant.MENTOR:
                assert(p.interests == [
                    'Increasing Impact on Mozilla Mission',
                    'Public Speaking',
                ])
            else:
                assert(p.interests == [
                    'Technical Leadership',
                ])
            assert(p.track_change == ('Maybe' if role == Participant.LEARNER else None))
            assert(p.org_chart_distance == 'Prefer distant')
            assert(p.comments == 'asdf')

    def test_post_no_role(self):
        response = self.make_post({})

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)

        self.assertRaises(
            Participant.DoesNotExist,
            lambda: Participant.objects.get(email='adoe@mozilla.com'))

    def test_post_mentor_only(self):
        response = self.make_post({
            'role[0]': 'M',
            'time_availability[0]': '09:00 - 12:00 UTC',
            'mentor_interests[0]': 'Increasing Impact on Mozilla Mission',
            'mentor_interests[1]': 'Public Speaking',
            'org_chart_distance': 'Prefer distant',
            'comments': 'asdf',
        })

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)

        p = Participant.objects.get(email='adoe@mozilla.com')
        assert(p.expires > datetime.datetime.now(tz=pytz.UTC))
        assert(p.email == 'adoe@mozilla.com')
        assert(p.role == Participant.MENTOR)
        assert(p.full_name == 'Alex Doe')
        assert(p.manager == 'Mana Jerr')
        assert(p.manager_email == 'mjerr@mozilla.com')
        assert(p.approved is None)
        assert(p.time_availability == 'NNNNNNNNNYYYNNNNNNNNNNNN')
        assert(p.org == 'Firefox')
        assert(p.org_level == 'P3')
        assert(p.time_at_org_level == '1-2 y')
        assert(p.interests == [
            'Increasing Impact on Mozilla Mission',
            'Public Speaking',
        ])
        assert(p.track_change is None)
        assert(p.org_chart_distance == 'Prefer distant')
        assert(p.comments == 'asdf')

    def test_post_already_exists(self):
        response = self.make_post({'role[0]': 'M', 'comment': 'first'})
        response = self.make_post({'role[0]': 'M', 'comment': 'second'})
