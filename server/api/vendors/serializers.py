from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ServiceCategory, ArtisanProfile, PortfolioItem, Review

User = get_user_model()


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description', 'icon']


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'description', 'image', 'project_date', 'client_name', 'created_at']
        read_only_fields = ['id', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)
    reviewer_username = serializers.CharField(source='reviewer.username', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'artisan', 'reviewer', 'reviewer_name', 'reviewer_username', 'project',
            'rating', 'title', 'comment', 'professionalism', 'quality_of_work', 
            'timeliness', 'communication', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reviewer', 'created_at', 'updated_at']


class ArtisanProfileSerializer(serializers.ModelSerializer):
    services = ServiceCategorySerializer(many=True, read_only=True)
    service_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=ServiceCategory.objects.all(), 
        source='services',
        write_only=True
    )
    portfolio = PortfolioItemSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = ArtisanProfile
        fields = [
            'id', 'user', 'user_name', 'user_email', 'business_name', 'description',
            'services', 'service_ids', 'experience_level', 'years_of_experience',
            'phone', 'email', 'address', 'city', 'state', 'country',
            'website', 'instagram', 'facebook',
            'is_available', 'is_featured', 'average_rating', 'total_reviews', 'total_projects',
            'hourly_rate', 'min_project_budget',
            'portfolio', 'reviews', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_featured', 'average_rating', 'total_reviews', 'total_projects', 'created_at', 'updated_at']


class ArtisanProfileListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    services = ServiceCategorySerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = ArtisanProfile
        fields = [
            'id', 'user_name', 'business_name', 'description', 'services',
            'city', 'state', 'is_available', 'average_rating', 'total_reviews',
            'total_projects', 'hourly_rate', 'created_at'
        ]
