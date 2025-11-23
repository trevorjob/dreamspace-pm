from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.users.views import UserViewSet
from api.projects.views import ProjectViewSet, TaskViewSet
from api.moodboards.views import MoodboardViewSet, MoodboardItemViewSet
from api.vendors.views import (
    ServiceCategoryViewSet,
    ArtisanProfileViewSet, PortfolioItemViewSet, ReviewViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'moodboards', MoodboardViewSet, basename='moodboard')
router.register(r'moodboard-items', MoodboardItemViewSet, basename='moodboard-item')

# Marketplace endpoints
router.register(r'service-categories', ServiceCategoryViewSet, basename='service-category')
router.register(r'artisans', ArtisanProfileViewSet, basename='artisan')
router.register(r'portfolio', PortfolioItemViewSet, basename='portfolio-item')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    # JWT Authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API routes
    path('', include(router.urls)),
]
