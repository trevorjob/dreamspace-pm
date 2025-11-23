from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from api.users.models import User
from api.projects.models import Project, Task
from api.moodboards.models import Moodboard, MoodboardItem
from api.vendors.models import (
    ServiceCategory, ArtisanProfile, PortfolioItem, Review
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'phone', 'role', 'is_verified', 'is_staff']
    list_filter = ['role', 'is_verified', 'is_staff', 'is_superuser']
    search_fields = ['email', 'first_name', 'last_name', 'business_name']
    ordering = ['email']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone')}),
        ('Additional Info', {
            'fields': ('role', 'bio', 'location', 'profile_image', 'is_verified', 'business_name')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'role'),
        }),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client_name', 'user', 'start_date', 'end_date', 'created_at']
    list_filter = ['created_at', 'start_date', 'end_date']
    search_fields = ['name', 'client_name', 'description']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'due_date', 'created_at']
    list_filter = ['status', 'due_date', 'created_at']
    search_fields = ['title', 'description']


@admin.register(Moodboard)
class MoodboardAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'description']


@admin.register(MoodboardItem)
class MoodboardItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'moodboard', 'x', 'y', 'width', 'height', 'created_at']
    list_filter = ['created_at']


# Marketplace admin

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']
    search_fields = ['name', 'description']


@admin.register(ArtisanProfile)
class ArtisanProfileAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'user', 'city', 'state', 'experience_level', 'is_available', 'is_featured', 'average_rating', 'total_reviews']
    list_filter = ['experience_level', 'is_available', 'is_featured', 'state', 'services']
    search_fields = ['business_name', 'description', 'user__email', 'city']
    filter_horizontal = ['services']
    readonly_fields = ['average_rating', 'total_reviews', 'total_projects']
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'business_name', 'description', 'services')
        }),
        ('Experience', {
            'fields': ('experience_level', 'years_of_experience')
        }),
        ('Contact', {
            'fields': ('phone', 'email', 'address', 'city', 'state', 'country')
        }),
        ('Online Presence', {
            'fields': ('website', 'instagram', 'facebook')
        }),
        ('Marketplace', {
            'fields': ('is_available', 'is_featured', 'average_rating', 'total_reviews', 'total_projects')
        }),
        ('Pricing', {
            'fields': ('hourly_rate', 'min_project_budget')
        }),
    )


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'artisan', 'project_date', 'created_at']
    list_filter = ['project_date', 'created_at']
    search_fields = ['title', 'description', 'artisan__business_name', 'client_name']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['artisan', 'reviewer', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['artisan__business_name', 'reviewer__email', 'title', 'comment']
    readonly_fields = ['created_at', 'updated_at']

