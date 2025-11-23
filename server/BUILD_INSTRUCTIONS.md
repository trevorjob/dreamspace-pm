# DreamSpace PM - Django Backend Build Instructions

## Current Status
✅ Virtual environment created
✅ Dependencies installed
✅ Django project `project` created
✅ Django app `api` created

## Next Steps to Complete the Build

### 1. Update `project/settings.py`

Add these to `INSTALLED_APPS`:
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'cloudinary',
    
    # Local
    'api',
]
```

Add to `MIDDLEWARE` (before CommonMiddleware):
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Add this
    'django.middleware.common.CommonMiddleware',
    # ... rest of middleware
]
```

Add at the end of settings.py:
```python
import environ
import cloudinary

env = environ.Env()
environ.Env.read_env()

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}

# JWT Settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

# Cloudinary
cloudinary.config(
    cloud_name = env('CLOUDINARY_CLOUD_NAME', default=''),
    api_key = env('CLOUDINARY_API_KEY', default=''),
    api_secret = env('CLOUDINARY_API_SECRET', default=''),
)
```

### 2. Create Modular Structure in `api/`

Create these directories:
```
api/
├── users/
│   ├── __init__.py
│   ├── models.py
│   ├── serializers.py
│   └── views.py
├── projects/
│   ├── __init__.py
│   ├── models.py
│   ├── serializers.py
│   └── views.py
├── moodboards/
│   ├── __init__.py
│   ├── models.py
│   ├── serializers.py
│   └── views.py
└── vendors/
    ├── __init__.py
    ├── models.py
    ├── serializers.py
    └── views.py
```

### 3. Create Models

#### `api/users/models.py`:
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return self.email or self.username
```

#### `api/projects/models.py`:
```python
from django.db import models
from django.conf import settings

class Project(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    client_name = models.CharField(max_length=200)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
```

#### `api/moodboards/models.py`:
```python
from django.db import models
from api.projects.models import Project
import cloudinary.models

class Moodboard(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='moodboards')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class MoodboardItem(models.Model):
    moodboard = models.ForeignKey(Moodboard, on_delete=models.CASCADE, related_name='items')
    image = cloudinary.models.CloudinaryField('image')
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    width = models.FloatField(default=100)
    height = models.FloatField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Item in {self.moodboard.title}"
```

#### `api/vendors/models.py`:
```python
from django.db import models
import cloudinary.models

class Vendor(models.Model):
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = cloudinary.models.CloudinaryField('image', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
```

### 4. Update `project/settings.py` to use custom User model

Add:
```python
AUTH_USER_MODEL = 'users.User'
```

But first, move the User model to `api/users/models.py` and register it properly.

### 5. Create Serializers and Views

Follow Django REST Framework patterns to create serializers and ViewSets for each model.

### 6. Create URL Routing

Update `project/urls.py` to include API routes with routers.

### 7. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 8. Run the Server

```bash
python manage.py runserver
```

## Notes

- The structure follows the README requirements
- Uses SQLite for local development (change to PostgreSQL for production)
- JWT authentication is configured
- CORS is set up for Next.js frontend
- Cloudinary is integrated for file uploads

Would you like me to create the complete serializers, views, and URLs configuration?
