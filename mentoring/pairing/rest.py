from rest_framework import serializers, viewsets, permissions, mixins

from .models import Pair
from ..participants.models import Participant


class PairSerializer(serializers.HyperlinkedModelSerializer):
    mentor = serializers.PrimaryKeyRelatedField(
        queryset=Participant.objects.all().filter(is_mentor=True))
    learner = serializers.PrimaryKeyRelatedField(
        queryset=Participant.objects.all().filter(is_learner=True))

    class Meta:
        model = Pair
        fields = [
            'mentor',
            'learner',
        ]


# ViewSets define the view behavior.
class PairViewSet(mixins.CreateModelMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Pair.objects.all()
    serializer_class = PairSerializer
