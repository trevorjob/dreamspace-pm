from rest_framework import serializers
from .models import Moodboard, MoodboardItem


class MoodboardItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodboardItem
        fields = ['id', 'moodboard', 'image', 'x', 'y', 'width', 'height', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class MoodboardSerializer(serializers.ModelSerializer):
    items = MoodboardItemSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Moodboard
        fields = ['id', 'project', 'title', 'description', 'items', 'items_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_items_count(self, obj):
        return obj.items.count()
