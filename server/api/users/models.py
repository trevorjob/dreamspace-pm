from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom user model with additional fields and user roles"""
    
    USER_ROLES = [
        ('designer', 'Interior Designer'),
        ('client', 'Client'),
        ('artisan', 'Artisan/Vendor'),
    ]
    
    # Make username optional and use email as primary identifier
    username = None
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = UserManager()
    
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=USER_ROLES, default='designer')
    bio = models.TextField(blank=True, help_text='Professional bio or description')
    location = models.CharField(max_length=200, blank=True, help_text='City, State/Country')
    profile_image = models.URLField(blank=True, help_text='Profile image URL (Cloudinary)')
    
    # For artisans/vendors
    is_verified = models.BooleanField(default=False, help_text='Verified artisan/vendor')
    business_name = models.CharField(max_length=200, blank=True, help_text='Business or company name')
    
    def __str__(self):
        return self.email
    
    @property
    def is_designer(self):
        return self.role == 'designer'
    
    @property
    def is_client(self):
        return self.role == 'client'
    
    @property
    def is_artisan(self):
        return self.role == 'artisan'
