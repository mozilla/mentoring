from rest_framework import serializers, viewsets, permissions

from .models import Participant

class ParticipantSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'


# ViewSets define the view behavior.
class ParticipantViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
