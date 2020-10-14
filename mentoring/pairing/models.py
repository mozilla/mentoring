import hmac
import datetime
import pytz
from textwrap import dedent

from django.conf import settings
from django.db import models

from ..participants.models import Participant

class Pair(models.Model):
    """
    An active pairing in the program.
    """

    def __str__(self):
        return f'{self.mentor} / {self.learner}'

    learner = models.ForeignKey(
        Participant,
        related_name='learner_pairing',
        on_delete=models.RESTRICT,
    )
    mentor = models.ForeignKey(
        Participant,
        related_name='mentor_pairing',
        on_delete=models.RESTRICT,
    )

    start_date = models.DateTimeField(
        null=False,
        default=lambda: datetime.datetime.now(pytz.UTC), 
        help_text=dedent('''Date this pairing began''')
    )

    def pair_id(self):
        """Determine the `pair_id` for this pair."""
        h = hmac.new(bytes(settings.PAIR_ID_HASH_SECRET, 'utf8'), digestmod='SHA256')
        h.update(self.learner.email.encode('utf8'))
        h.update(b'|')
        h.update(self.mentor.email.encode('utf8'))
        return h.hexdigest()

    class Meta:
        db_table = "pairs"


class HistoricalPair(models.Model):
    """
    A pair that has already occurred, constructed in a privacy-protecting
    fashion.  This is used to detect re-pairing of a previous pair without
    storing personally-idnetifiable information about participants
    indefinitely.
    """

    @classmethod
    def record_pairing(cls, pair):
        """Record that a pairing has been made."""
        hp = cls(pair.pair_id())
        hp.save()

    @classmethod
    def already_paired(cls, pair):
        """Check whether this pariring has already been made."""
        pair_id = pair.pair_id()
        try:
            cls.objects.get(pair_id=pair_id)
            return True
        except cls.DoesNotExist:
            return False

    pair_id = models.CharField(
        null=False,
        max_length=64,
        primary_key=True,
        help_text=dedent('''\
            HMAC-SHA256 of `<learner-email>|<mentor-email>` using key
            settings.HISTORICAL_PAIR_KEY.'''),
    )

    class Meta:
        db_table = "historical_pairs"
