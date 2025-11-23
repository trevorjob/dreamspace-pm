#!/bin/bash

echo "DreamSpace PM - Resetting Database and Seeding Data"
echo ""

# Check if we're in the server directory
if [ ! -f "manage.py" ]; then
    echo "Error: Please run this script from the server directory"
    exit 1
fi

# Remove existing database
echo "Removing existing database..."
if [ -f "db.sqlite3" ]; then
    rm -f db.sqlite3
    echo "  Database removed"
else
    echo "  No existing database found"
fi

# Remove existing migrations (except __init__.py)
echo ""
echo "Removing old migrations..."

for app in "api/users" "api/projects" "api/moodboards" "api/vendors"; do
    migrations_path="$app/migrations"
    if [ -d "$migrations_path" ]; then
        find "$migrations_path" -name "*.py" ! -name "__init__.py" -delete
        find "$migrations_path" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
    fi
done

# Create new migrations
echo ""
echo "Creating new migrations..."
python manage.py makemigrations

# Run migrations
echo ""
echo "Running migrations..."
python manage.py migrate

# Seed data
echo ""
echo "Seeding database with sample data..."
python manage.py seed_data

echo ""
echo "Database reset and seeding complete!"
echo ""
echo "You can now start the server with: python manage.py runserver"
