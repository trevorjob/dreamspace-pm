# DreamSpace PM - Database Reset and Seed Script

Write-Host "DreamSpace PM - Resetting Database and Seeding Data" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the server directory
if (-not (Test-Path "manage.py")) {
    Write-Host "Error: Please run this script from the server directory" -ForegroundColor Red
    exit 1
}

# Remove existing database
Write-Host "Removing existing database..." -ForegroundColor Yellow
if (Test-Path "db.sqlite3") {
    Remove-Item "db.sqlite3" -Force
    Write-Host "  Database removed" -ForegroundColor Green
} else {
    Write-Host "  No existing database found" -ForegroundColor Gray
}

# Remove existing migrations (except __init__.py)
Write-Host ""
Write-Host "Removing old migrations..." -ForegroundColor Yellow

$apps = @("api\users", "api\projects", "api\moodboards", "api\vendors")
foreach ($app in $apps) {
    $migrationsPath = "$app\migrations"
    if (Test-Path $migrationsPath) {
        Get-ChildItem $migrationsPath -Filter "*.py" | Where-Object { $_.Name -ne "__init__.py" } | ForEach-Object {
            Remove-Item $_.FullName -Force
            Write-Host "  Removed $($_.Name)" -ForegroundColor Gray
        }
        # Also remove __pycache__
        $pycachePath = "$migrationsPath\__pycache__"
        if (Test-Path $pycachePath) {
            Remove-Item $pycachePath -Recurse -Force
        }
    }
}

# Create new migrations
Write-Host ""
Write-Host "Creating new migrations..." -ForegroundColor Yellow
python manage.py makemigrations

# Run migrations
Write-Host ""
Write-Host "Running migrations..." -ForegroundColor Yellow
python manage.py migrate

# Seed data
Write-Host ""
Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
python manage.py seed_data

Write-Host ""
Write-Host "Database reset and seeding complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start the server with: python manage.py runserver" -ForegroundColor Cyan
