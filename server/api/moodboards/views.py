from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Moodboard, MoodboardItem
from .serializers import MoodboardSerializer, MoodboardItemSerializer


class MoodboardViewSet(viewsets.ModelViewSet):
    serializer_class = MoodboardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Moodboard.objects.filter(project__user=self.request.user)


class MoodboardItemViewSet(viewsets.ModelViewSet):
    serializer_class = MoodboardItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MoodboardItem.objects.filter(moodboard__project__user=self.request.user)
