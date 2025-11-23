# DreamSpace PM - Quick Start Guide

## ✅ Build Status: SUCCESS

The Next.js frontend now builds successfully with no TypeScript errors!

---

## Getting Started

### 1. Start the Backend (Django)

```powershell
cd c:\Users\HP\Videos\programming\dreamspace-pm\server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### 2. Start the Frontend (Next.js)

```powershell
cd c:\Users\HP\Videos\programming\dreamspace-pm\client
npm install
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## Environment Setup

### Backend (.env)

Create `server/.env`:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (.env.local)

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Default User Accounts

After running migrations, create test users:

```powershell
# In server directory
python manage.py createsuperuser
```

Or use the registration page at: `http://localhost:3000/register`

---

## Feature Overview

### ✅ Completed Features

1. **Authentication**
   - Login/Register
   - Role-based access (Designer, Client, Artisan)
   - JWT token management

2. **Projects**
   - Create, Read, Update, Delete projects
   - Project status tracking
   - Budget and timeline management

3. **Tasks**
   - Kanban board with 4 columns
   - Priority levels (low, medium, high, urgent)
   - Status tracking
   - Search and filter

4. **Moodboards**
   - Create moodboards for projects
   - Upload and position images
   - Drag-and-drop interface
   - Image management

5. **Marketplace**
   - Browse artisan directory
   - Filter by category and rating
   - Search functionality
   - View detailed profiles

6. **Artisan Profiles**
   - Business information
   - Service categories
   - Portfolio showcase
   - Reviews and ratings

7. **Portfolio Management** (Artisan only)
   - Upload portfolio items
   - Manage project examples
   - Display work history

8. **Reviews System**
   - Submit reviews for artisans
   - 5-star rating system
   - Written feedback
   - Rating statistics

---

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/token/refresh/` - Refresh token

### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}/` - Get project details
- `PATCH /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

### Tasks
- `GET /api/tasks/` - List tasks
- `POST /api/tasks/` - Create task
- `PATCH /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

### Moodboards
- `GET /api/moodboards/` - List moodboards
- `POST /api/moodboards/` - Create moodboard
- `GET /api/moodboards/{id}/` - Get moodboard details
- `DELETE /api/moodboards/{id}/` - Delete moodboard

### Moodboard Items
- `GET /api/moodboard-items/` - List items
- `POST /api/moodboard-items/` - Upload item (multipart/form-data)
- `PATCH /api/moodboard-items/{id}/` - Update item position
- `DELETE /api/moodboard-items/{id}/` - Delete item

### Artisans
- `GET /api/artisans/` - List artisans
- `GET /api/artisans/{id}/` - Get artisan details
- `GET /api/artisans/my-profile/` - Get current user's profile
- `POST /api/artisans/` - Create profile
- `PATCH /api/artisans/{id}/` - Update profile

### Portfolio
- `GET /api/portfolio/` - List portfolio items
- `POST /api/portfolio/` - Upload portfolio item
- `DELETE /api/portfolio/{id}/` - Delete item

### Reviews
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Submit review

### Service Categories
- `GET /api/service-categories/` - List categories

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Framework**: Django 5.0
- **API**: Django REST Framework
- **Authentication**: JWT (Simple JWT)
- **Database**: SQLite (development)
- **File Storage**: Django default

---

## Troubleshooting

### Port Already in Use

**Frontend**:
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

**Backend**:
```powershell
# Kill process on port 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
```

### CORS Errors
- Check backend `.env` has correct `CORS_ALLOWED_ORIGINS`
- Check frontend `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Restart both servers after changing environment variables

### Build Errors
```powershell
# Clean and rebuild
cd client
Remove-Item -Recurse -Force .next
npm run build
```

### Database Issues
```powershell
# Reset database
cd server
Remove-Item db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

## Development Workflow

1. **Make changes** to frontend or backend code
2. **Test locally** with dev servers running
3. **Check for errors** in browser console and terminal
4. **Build frontend** to verify TypeScript types: `npm run build`
5. **Run backend tests**: `python manage.py test`
6. **Commit changes** with descriptive messages

---

## Project Structure

```
dreamspace-pm/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── lib/               # Utilities, types, API client
│   └── public/            # Static assets
│
└── server/                # Django backend
    ├── api/               # Main API app
    ├── project/           # Django settings
    └── requirements.txt   # Python dependencies
```

---

## Support & Documentation

- **Frontend**: See `client/README.md`
- **Backend**: See `server/README.md`
- **Build Fixes**: See `client/BUILD_FIXES.md`
- **Testing Guide**: See `server/TESTING_GUIDE.md`

---

## License

[Your License Here]

---

**Happy Coding! 🚀**
