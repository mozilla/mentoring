from rest_framework import serializers, viewsets, routers

from .participants.rest import ParticipantViewSet
from .pairing.rest import PairViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'participants', ParticipantViewSet)
router.register(r'pairs', PairViewSet)
