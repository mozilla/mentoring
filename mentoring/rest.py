from rest_framework import serializers, viewsets, routers

from .participants.rest import ParticipantViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'participants', ParticipantViewSet)
