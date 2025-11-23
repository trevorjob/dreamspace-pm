from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField


class ServiceCategory(models.Model):
    """Categories for services offered by artisans/vendors"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon name for frontend')
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Service Categories'
    
    def __str__(self):
        return self.name


class ArtisanProfile(models.Model):
    """Extended profile for artisans/vendors in the marketplace"""
    
    EXPERIENCE_LEVELS = [
        ('beginner', 'Beginner (0-2 years)'),
        ('intermediate', 'Intermediate (3-5 years)'),
        ('expert', 'Expert (6-10 years)'),
        ('master', 'Master (10+ years)'),
    ]
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='artisan_profile')
    business_name = models.CharField(max_length=200, help_text='Business or company name')
    description = models.TextField(help_text='Detailed description of services offered')
    services = models.ManyToManyField(ServiceCategory, related_name='artisans', help_text='Services offered')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS, default='intermediate')
    years_of_experience = models.PositiveIntegerField(default=0)
    
    # Contact & Location
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='Nigeria')
    
    # Online presence
    website = models.URLField(blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    facebook = models.CharField(max_length=100, blank=True)
    
    # Marketplace features
    is_available = models.BooleanField(default=True, help_text='Available for new projects')
    is_featured = models.BooleanField(default=False, help_text='Featured artisan')
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.PositiveIntegerField(default=0)
    total_projects = models.PositiveIntegerField(default=0, help_text='Number of completed projects')
    
    # Pricing
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    min_project_budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-average_rating', 'business_name']
    
    def __str__(self):
        return f"{self.business_name} - {self.user.get_full_name() or self.user.username}"


class PortfolioItem(models.Model):
    """Portfolio items for artisan profiles"""
    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE, related_name='portfolio')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.URLField(max_length=500, help_text='Image URL (Cloudinary or external)')
    project_date = models.DateField(null=True, blank=True)
    client_name = models.CharField(max_length=200, blank=True, help_text='Optional client name')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.artisan.business_name} - {self.title}"


class Review(models.Model):
    """Reviews for artisans from designers/clients"""
    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_given')
    project = models.ForeignKey('projects.Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], help_text='Rating from 1-5')
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    
    # Review metrics
    professionalism = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    quality_of_work = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    timeliness = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    communication = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['artisan', 'reviewer', 'project']  # One review per project
    
    def __str__(self):
        return f"Review for {self.artisan.business_name} by {self.reviewer.get_full_name() or self.reviewer.username}"
