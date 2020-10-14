import re
import pytz
import datetime
import json
import logging

from django.conf import settings
from django.http import HttpResponse
from django.core.exceptions import SuspiciousOperation
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from ..participants.models import Participant

logger = logging.getLogger(__name__)

def time_availability(time_availability):
    '''Parse a list of 'xx:00 - xx:00 UTC' strings into the 24-hour format in the model'''
    rv = ['N'] * 24
    for avail in time_availability:
        mo = re.match(r'(\d{2}):00\s*-\s*(\d{2}):00\s*UTC$', avail)
        for hr in range(int(mo.group(1)), int(mo.group(2)) or 24):
            rv[hr] = 'Y'
    return ''.join(rv)


def parse_form(form):
    '''Parse the "form" submission from Alchemer.  This is a bit weird, and undocumented!'''
    # alchemer does its own encoding of multi-valued properties, so decode that
    def getlist(key):
        i = 0
        res = []
        while True:
            k = f'{key}[{i}]'
            try:
                res.append(form[k])
            except KeyError:
                return res
            i += 1

    roles = getlist('role')

    for role in roles:
        assert(role in 'ML')
        yield dict(
            expires=datetime.datetime.now(tz=pytz.UTC) + datetime.timedelta(days=settings.DATA_RETENTION_DAYS),
            email=form['email'],
            role={'M': Participant.MENTOR, 'L': Participant.LEARNER}[role],
            full_name=form['full_name'],
            manager=form['manager'],
            manager_email=form['manager_email'],
            approved=None,
            time_availability=time_availability(getlist('time_availability')),
            org=form['org'],
            org_level=form['org_level'],
            time_at_org_level=form['time_at_org_level'],
            interests=getlist('learner_interests' if role == 'L' else 'mentor_interests'),
            track_change=form['track_change'] if role == 'L' else None,
            org_chart_distance=form['org_chart_distance'],
            comments=form['comments'],
        )



@require_http_methods(["POST"])
@csrf_exempt
def webhook(request):
    '''A webhook reuqest from Alchemer.'''
    if request.content_type != 'application/x-www-form-urlencoded':
        raise SuspiciousOperation("webhooks must be of content-type application/x-www-form-urlencoded")

    for pdict in parse_form(request.POST):
        (p, created) = Participant.objects.update_or_create(
            email=pdict['email'], role=pdict['role'],
            defaults=pdict)
        action = 'created participant' if created else 'updated existing participant'
        logger.info(f'webhook received for {p} - {action}')

    return HttpResponse("OK", status=200)
