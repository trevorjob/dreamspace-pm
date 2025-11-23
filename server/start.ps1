# DreamSpace PM - Quick Start Guide

Write-Host "🚀 Starting DreamSpace PM Backend..." -ForegroundColor Cyan

# Activate virtual environment
Write-Host "`n📦 Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Check if .env exists
if (-Not (Test-Path .env)) {
    Write-Host "`n⚠️  .env file not found! Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Please update .env with your Cloudinary credentials!" -ForegroundColor Green
}

# Run migrations
Write-Host "`n🔧 Checking database..." -ForegroundColor Yellow
python manage.py migrate

# Check for issues
Write-Host "`n✔️  Running system checks..." -ForegroundColor Yellow
python manage.py check

Write-Host "`n✅ Backend is ready!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create superuser: python manage.py createsuperuser" -ForegroundColor White
Write-Host "2. Start server: python manage.py runserver" -ForegroundColor White
Write-Host "3. Access API: http://127.0.0.1:8000/api/" -ForegroundColor White
Write-Host "4. Access Admin: http://127.0.0.1:8000/admin/`n" -ForegroundColor White
