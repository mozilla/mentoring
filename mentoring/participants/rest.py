from rest_framework import serializers, viewsets, permissions, decorators, status, mixins, exceptions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Participant, current_expiration


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

    def validate(self, data):
        """Require that the `email` property, if given, matches the user during deserialization"""
        if not self.context or "request" not in self.context:
            raise serializers.ValidationError("validation requires request context")
        request = self.context['request']

        if 'email' in data and data['email'] != request.user.email:
            raise serializers.ValidationError({"email": "email field must match your own email"})

        return data


class IsParticipantOrAdminUser(permissions.BasePermission):
    """
    Object-level permission to allow users to access their own participant record.
    """

    # note that this cannot be represented as IsParticipant | IsAdminUser, as the
    # IsAdminUser class is a view-level permission

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if request.user.is_anonymous:
            return False
        return obj.email == request.user.email


class ParticipantViewSet(
        mixins.CreateModelMixin,
        mixins.UpdateModelMixin,
        viewsets.ReadOnlyModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    def get_permissions(self):
        # non-admin users cannot list anything..
        if self.action == 'list':
            permission_classes = [permissions.IsAdminUser]
        else:
            # ..but can read, create, and update (and by_email) their own user
            permission_classes = [IsParticipantOrAdminUser]
        return [permission() for permission in permission_classes]

    @decorators.action(detail=False, url_path='by_email')
    def by_email(self, request, pk=None):
        """Get a participant by their email address, using `?email=..`"""
        email = request.query_params.get('email', None)
        if email is None:
            return Response("Missing `email` query parameter", status=status.HTTP_400_BAD_REQUEST)
        particip = get_object_or_404(Participant, email=email)
        self.check_object_permissions(self.request, particip)
        data = self.serializer_class(particip).data
        return Response(data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        # on every update, bump the expiration time
        serializer.save(expires=current_expiration())
