from django.db import models
from textwrap import dedent

class Participant(models.Model):
    """
    A Participant in the program.
    """

    MENTOR = 'M'
    LEARNER = 'L'

    def __str__(self):
        return self.full_name

    expires = models.DateTimeField(null=False, help_text=dedent('''\
        The date that this information expires.  This can be extended (such as when
        a pairing is made), and expiration is contingent on not being in a current
        pair.  This field accomplishes the "lean data" practice of not keeping
        user information forever. '''))

    email = models.EmailField(null=False, help_text=dedent('''\
        The participant's work email address.  This is used as a key. '''))

    role = models.CharField(
        max_length=1,
        null=False,
        choices=[(MENTOR, 'Mentor'), (LEARNER, 'Learner')],
        help_text=dedent('''\
            The participant's role in the program.  Note that the same email may appear
            at most once in each role.'''),
        )

    full_name = models.CharField(null=False, max_length=512, help_text=dedent('''\
        The participant's full name (as they would prefer to be called).'''))

    manager_email = models.EmailField(null=False, help_text=dedent('''\
        The participant's manager's email address.  This is used to verify approval. '''))

    approved = models.BooleanField(help_text=dedent('''\
        Whether this participant's participation has been approved by their manager.
        Null means "not yet"; we treat silence from managers as consent.'''))

    time_availability = models.CharField(
        max_length=24,
        null=False,
        help_text=dedent('''\
            The participant's time availability, as a sequence of Y and N for each UTC hour,
            so `NNNYYYYYYYYYNNNNNNNNNNNN` indicates availability from 03:00-12:00 UTC.'''),
        # TODO: add a validator
        )

    org = models.CharField(max_length=100, null=True, help_text=dedent('''\
        Participant's organization (roughly, executive to whom they report)'''))

    org_level = models.CharField(max_length=10, null=True, help_text=dedent('''\
        Participant's current organizational level, e.g., `P3` or `M4`'''))

    time_at_org_level = models.CharField(max_length=10, null=True, help_text=dedent('''\
        Participant's time at current organizational level, e.g., `2-3 y`'''))

    interests = models.JSONField(null=True, blank=False, help_text=dedent('''\
        A learner's areas of interest, or a mentor's areas in which they can offer mentorship;
        format is an array of open-text strings.'''),
        # TODO: add a validator
        )

    org_chart_distance = models.CharField(
        max_length=20,
        null=True,
        blank=False,
        help_text=dedent('''Preference for a pairing nearby or distant in the org chart (open text)''')
        )

    class Meta:
        unique_together = (('email', 'role'))
