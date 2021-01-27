from rest_framework import serializers, viewsets, permissions, decorators, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Participant


class ParticipantSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Participant
        fields = [
            'id',
            'email',
            'is_mentor',
            'is_learner',
            'full_name',
            'manager',
            'manager_email',
            'approved',
            'time_availability',
            'org',
            'org_chart_distance',
            'org_level',
            'time_at_org_level',
            'learner_interests',
            'mentor_interests',
            'track_change',
            'comments',
        ]


# ViewSets define the view behavior.
class ParticipantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    @decorators.action(detail=False, url_path='by_email')
    def by_email(self, request, pk=None):
        """Get a participant by their email address, using `?email=..`"""
        email = request.query_params.get('email', None)
        if email is None:
            return Response("Missing `email` query parameter", status=status.HTTP_400_BAD_REQUEST)
        particip = get_object_or_404(Participant, email=email)
        data = self.serializer_class(particip).data
        return Response(data, status=status.HTTP_200_OK)
