from django.db import models
from api.projects.models import Project


class Moodboard(models.Model):
    """Moodboard model belonging to a project"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='moodboards')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class MoodboardItem(models.Model):
    """Individual items in a moodboard with positioning"""
    moodboard = models.ForeignKey(Moodboard, on_delete=models.CASCADE, related_name='items')
    image = models.URLField(max_length=500, help_text='Image URL (Cloudinary or external)')
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    width = models.FloatField(default=100)
    height = models.FloatField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Item in {self.moodboard.title}"
