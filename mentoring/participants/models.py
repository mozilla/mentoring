import pytz
import datetime

from django.db import models
from django.conf import settings
from textwrap import dedent

from django.core.exceptions import ValidationError


def validate_time_availability(time_availability):
    if len(time_availability) != 24:
        raise ValidationError('time_availability must be 24 characters')
    if any(c not in 'YN' for c in time_availability):
        raise ValidationError('time_availability must contain only Y and N characters')


def validate_interests(interests):
    if type(interests) != list:
        raise ValidationError('interests must be a list')
    if any(not isinstance(i, str) for i in interests):
        raise ValidationError('interests must contain strings')


def current_expiration():
    """Return an appropriate expiration date for a participant updated today."""
    return datetime.datetime.now(pytz.UTC) + datetime.timedelta(days=settings.DATA_RETENTION_DAYS)


class Participant(models.Model):
    """
    A Participant in the program.
    """

    def __str__(self):
        return f'{self.full_name}'

    expires = models.DateTimeField(
        null=False,
        default=current_expiration,
        help_text=dedent('''\
            The date that this information expires.  This can be extended (such as when
            a pairing is made), and expiration is contingent on not being in a current
            pair.  This field accomplishes the "lean data" practice of not keeping
            user information forever. '''))

    email = models.EmailField(null=False, unique=True, help_text=dedent('''\
        The participant's work email address.  This is used as a key. '''))

    is_mentor = models.BooleanField(null=False, help_text=dedent('''\
        True if this participant will act as a mentor.'''))

    is_learner = models.BooleanField(null=False, help_text=dedent('''\
        True if this participant will act as a learner.'''))

    full_name = models.CharField(null=False, max_length=512, help_text=dedent('''\
        The participant's full name (as they would prefer to be called).'''))

    manager = models.CharField(null=False, max_length=512, help_text=dedent('''\
        The participant's manager's name.'''))

    manager_email = models.EmailField(null=False, help_text=dedent('''\
        The participant's manager's email address.  This is used to verify approval. '''))

    approved = models.BooleanField(null=True, help_text=dedent('''\
        Whether this participant's participation has been approved by their manager.
        Null means "not yet"; we treat silence from managers as consent.'''))

    time_availability = models.CharField(
        max_length=24,
        null=False,
        validators=[validate_time_availability],
        help_text=dedent('''\
            The participant's time availability, as a sequence of Y and N for each UTC hour,
            so `NNNYYYYYYYYYNNNNNNNNNNNN` indicates availability from 03:00-12:00 UTC.'''),
    )

    org = models.CharField(max_length=100, null=True, help_text=dedent('''\
        Participant's organization (roughly, executive to whom they report)'''))

    org_level = models.CharField(max_length=10, null=True, help_text=dedent('''\
        Participant's current organizational level, e.g., `P3` or `M4`'''))

    time_at_org_level = models.CharField(max_length=10, null=True, help_text=dedent('''\
        Participant's time at current organizational level, e.g., `2-3 y`'''))

    mentor_interests = models.JSONField(
        null=True,
        blank=False,
        help_text=dedent('''\
            A mentor's areas in which they can offer mentorship; format is an array of open-text strings.'''),
        validators=[validate_interests],
    )

    learner_interests = models.JSONField(
        null=True,
        blank=False,
        help_text=dedent('''\
            A learner's areas of interest; format is an array of open-text strings.'''),
        validators=[validate_interests],
    )

    track_change = models.CharField(null=True, max_length=64, help_text=dedent('''\
        Whether a learner is interested in changing tracks (between IC and Manager)'''))

    org_chart_distance = models.CharField(
        max_length=20,
        null=True,
        blank=False,
        help_text=dedent('''Preference for a pairing nearby or distant in the org chart (open text)''')
    )

    comments = models.TextField(
        null=False,
        blank=True,
        help_text=dedent('''Open comments from the participant's enrollment'''),
    )

    def bump_expiration(self):
        """Bump the expiration time for this participant, such as when making a substantive
        change to the participant's record."""
        self.expires = current_expiration()

    class Meta:
        db_table = "participants"
