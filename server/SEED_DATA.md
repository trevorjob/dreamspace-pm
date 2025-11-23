# Seed Data Reference

## Reset and Seed Database

**Run this command:**
```powershell
cd server
python manage.py seed_data
```

## Login Credentials

All users have password: `password123`

### Test Accounts
- **sarah.chen@example.com** - Designer
- **david.carpenter@example.com** - Artisan/Carpenter

## What Gets Created

- 2 Users (1 designer, 1 artisan)
- 2 Service Categories (Carpentry, Painting)  
- 1 Artisan Profile with services
- 1 Project
- 1 Task
- 1 Moodboard

## Complete Database Reset

If you need to completely reset the database:

```powershell
cd server
Remove-Item db.sqlite3
python manage.py migrate
python manage.py seed_data
```
