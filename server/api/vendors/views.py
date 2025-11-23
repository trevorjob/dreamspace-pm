from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django.db.models import Q, Avg
from .models import ServiceCategory, ArtisanProfile, PortfolioItem, Review
from .serializers import (
    ServiceCategorySerializer,
    ArtisanProfileSerializer, ArtisanProfileListSerializer,
    PortfolioItemSerializer, ReviewSerializer
)


class ServiceCategoryViewSet(viewsets.ModelViewSet):
    """Service categories for artisan marketplace"""
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Anyone can view, only authenticated can modify


class ArtisanProfileViewSet(viewsets.ModelViewSet):
    """Artisan profiles for marketplace - public viewing, authenticated editing"""
    queryset = ArtisanProfile.objects.filter(is_available=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['business_name', 'description', 'city', 'state', 'services__name']
    ordering_fields = ['average_rating', 'total_reviews', 'total_projects', 'created_at', 'hourly_rate']
    ordering = ['-is_featured', '-average_rating']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ArtisanProfileListSerializer
        return ArtisanProfileSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by service category
        service = self.request.query_params.get('service', None)
        if service:
            queryset = queryset.filter(services__id=service)
        
        # Filter by location
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        state = self.request.query_params.get('state', None)
        if state:
            queryset = queryset.filter(state__icontains=state)
        
        # Filter by experience level
        experience = self.request.query_params.get('experience', None)
        if experience:
            queryset = queryset.filter(experience_level=experience)
        
        # Filter by availability
        available = self.request.query_params.get('available', None)
        if available is not None:
            queryset = queryset.filter(is_available=available.lower() == 'true')
        
        # Filter by featured
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        
        # Filter by minimum rating
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            try:
                queryset = queryset.filter(average_rating__gte=float(min_rating))
            except ValueError:
                pass
        
        return queryset.distinct()
    
    def perform_create(self, serializer):
        # Automatically set the user to the current user
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_profile(self, request):
        """Get the artisan profile for the current user"""
        try:
            profile = ArtisanProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except ArtisanProfile.DoesNotExist:
            return Response(
                {'detail': 'You do not have an artisan profile yet.'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def portfolio(self, request, pk=None):
        """Get portfolio items for an artisan"""
        artisan = self.get_object()
        portfolio_items = artisan.portfolio.all()
        serializer = PortfolioItemSerializer(portfolio_items, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get reviews for an artisan"""
        artisan = self.get_object()
        reviews = artisan.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class PortfolioItemViewSet(viewsets.ModelViewSet):
    """Portfolio items for artisans"""
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by artisan if provided
        artisan_id = self.request.query_params.get('artisan', None)
        if artisan_id:
            queryset = queryset.filter(artisan_id=artisan_id)
        
        # Only allow users to edit their own portfolio items
        if self.action in ['update', 'partial_update', 'destroy']:
            if hasattr(self.request.user, 'artisan_profile'):
                queryset = queryset.filter(artisan=self.request.user.artisan_profile)
        
        return queryset
    
    def perform_create(self, serializer):
        # Automatically set the artisan to the current user's profile
        if hasattr(self.request.user, 'artisan_profile'):
            serializer.save(artisan=self.request.user.artisan_profile)
        else:
            raise serializers.ValidationError(
                {'detail': 'You must create an artisan profile before adding portfolio items.'}
            )


class ReviewViewSet(viewsets.ModelViewSet):
    """Reviews for artisans"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
          # Filter by artisan if provided
        artisan_id = self.request.query_params.get('artisan', None)
        if artisan_id:
            queryset = queryset.filter(artisan_id=artisan_id)
        
        return queryset
    
    def perform_create(self, serializer):
        # Automatically set the reviewer to the current user
        review = serializer.save(reviewer=self.request.user)
        
        # Update artisan's average rating and review count
        artisan = review.artisan
        reviews = artisan.reviews.all()
        artisan.average_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        artisan.total_reviews = reviews.count()
        artisan.save()

