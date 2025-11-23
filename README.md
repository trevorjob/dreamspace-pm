# DreamSpace PM

A modern project management and moodboard tool designed specifically for interior designers.

## 🎯 Overview

DreamSpace PM helps interior designers manage projects, create visual moodboards, track tasks, and maintain a vendor/product catalog - all in one place.

## ✨ Features

- **Project Management** - Track client projects from planning to completion
- **Task Management** - Assign and monitor project tasks with priority levels
- **Moodboards** - Create visual boards with drag-and-drop positioned items
- **Vendor Catalog** - Maintain a directory of vendors and products
- **File Upload** - Cloudinary integration for image storage
- **JWT Authentication** - Secure token-based authentication
- **RESTful API** - Full CRUD operations for all resources

## 🚀 Status

**Backend**: ✅ **COMPLETE AND RUNNING**  
**Frontend**: 🚧 Coming Soon

The Django REST Framework backend is fully functional with all CRUD operations implemented.

## 📁 Project Structure

```text
dreamspace-pm/
├── server/              # Django REST Framework Backend
│   ├── api/            # Main API app
│   │   ├── users/      # User authentication
│   │   ├── projects/   # Projects & tasks
│   │   ├── moodboards/ # Moodboards & items
│   │   └── vendors/    # Vendors & products
│   ├── project/        # Django settings
│   ├── venv/           # Virtual environment
│   ├── db.sqlite3      # SQLite database
│   ├── STATUS.md       # Current status & features
│   ├── TESTING_GUIDE.md # API testing guide
│   └── README.md       # Backend documentation
└── README.md           # This file
```

## 🛠️ Technology Stack

### Backend

- **Django 5.0.1** - Web framework
- **Django REST Framework 3.14.0** - API framework
- **SimpleJWT 5.3.1** - JWT authentication
- **Cloudinary 1.40.0** - Image storage
- **django-cors-headers 4.3.1** - CORS handling
- **SQLite** - Database (development)

## 🏃 Quick Start

### Prerequisites

- Python 3.13+
- pip
- Virtual environment

### Setup & Run Backend

1. **Navigate to server directory**:

   ```powershell
   cd server
   ```

2. **Activate virtual environment**:

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies** (if not already installed):

   ```powershell
   pip install -r requirements.txt
   ```

4. **Create superuser** (for admin access):

   ```powershell
   python manage.py createsuperuser
   ```

5. **Start the server**:   ```

   Or use the quick start script:

   ```powershell
   .\start.ps1
   ```

6. **Access the API**:
   - API Root: <http://127.0.0.1:8000/api/>
   - Admin Panel: <http://127.0.0.1:8000/admin/>

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login/` - Get JWT token
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/users/` - Register new user
- `GET /api/users/me/` - Get current user info

### Resources (All require authentication)

- `GET|POST /api/projects/` - List/Create projects
- `GET|PUT|PATCH|DELETE /api/projects/{id}/` - Project detail
- `GET|POST /api/tasks/` - List/Create tasks
- `GET|PUT|PATCH|DELETE /api/tasks/{id}/` - Task detail
- `GET|POST /api/moodboards/` - List/Create moodboards
- `GET|PUT|PATCH|DELETE /api/moodboards/{id}/` - Moodboard detail
- `GET|POST /api/moodboard-items/` - List/Create moodboard items
- `GET|PUT|PATCH|DELETE /api/moodboard-items/{id}/` - Item detail
- `GET|POST /api/vendors/` - List/Create vendors
- `GET|PUT|PATCH|DELETE /api/vendors/{id}/` - Vendor detail
- `GET|POST /api/products/` - List/Create products
- `GET|PUT|PATCH|DELETE /api/products/{id}/` - Product detail

## 📖 Documentation

For detailed information, see:

- **[server/STATUS.md](server/STATUS.md)** - Complete status, features, and configuration
- **[server/TESTING_GUIDE.md](server/TESTING_GUIDE.md)** - Step-by-step API testing guide
- **[server/README.md](server/README.md)** - Backend-specific documentation

## 🧪 Testing the API

### Quick Test

1. **Register a user**:

   ```bash
   POST http://127.0.0.1:8000/api/users/
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "TestPass123!",
     "password2": "TestPass123!"
   }
   ```

2. **Login**:

   ```bash
   POST http://127.0.0.1:8000/api/auth/login/
   {
     "username": "testuser",
     "password": "TestPass123!"
   }
   ```

3. **Use the returned token** in subsequent requests:

   ```text
   Authorization: Bearer <your_access_token>
   ```

See [TESTING_GUIDE.md](server/TESTING_GUIDE.md) for comprehensive testing instructions.

## 🎨 Data Models

### User

- Username, email, password
- First name, last name, phone

### Project

- Name, description
- Client information (name, email, phone)
- Status (planning, in_progress, completed, on_hold)
- Budget, start date, end date

### Task

- Project (foreign key)
- Title, description
- Assigned to (user)
- Status (todo, in_progress, in_review, completed, cancelled)
- Priority (low, medium, high, urgent)
- Due date

### Moodboard

- Project (foreign key)
- Name, description
- Created by (user)

### MoodboardItem

- Moodboard (foreign key)
- Image (Cloudinary)
- Title, description, URL
- Position: x, y, width, height

### Vendor

- Name, description
- Website, contact email, phone

### Product

- Vendor (foreign key)
- Name, description, category
- Price, image (Cloudinary), URL

## 🔐 Security Features

- JWT token authentication
- Password hashing
- CORS protection
- User-specific data access (users only see their own projects/moodboards)
- Django's built-in security features

## 🌐 CORS Configuration

The backend is configured to accept requests from:

- `http://localhost:3000` (Next.js default)
- `http://localhost:5173` (Vite default)

To add more origins, edit `CORS_ALLOWED_ORIGINS` in `server/project/settings.py`.

## 📝 Environment Variables

Create a `.env` file in the `server/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 🚀 Next Steps

### Backend (Optional)

- [ ] Add Cloudinary credentials for production image hosting
- [ ] Switch to PostgreSQL for production
- [ ] Add filtering and search capabilities
- [ ] Implement additional custom endpoints
- [ ] Set up production deployment

### Frontend (To Be Built)

- [ ] Next.js/React application
- [ ] Authentication flow
- [ ] Project management interface
- [ ] Drag-and-drop moodboard builder
- [ ] Vendor/product catalog browser
- [ ] File upload integration

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

MIT License - feel free to use this project as a template for your own applications.

## 👨‍💻 Author

Built with Django REST Framework for interior designers, artisans, and creative professionals.

---

**Current Status**: Backend is complete and running. Ready for frontend integration! ✅

For questions or issues, please check the documentation in the `server/` directory.

Add CORS settings for Next.js frontend

Add Swagger docs via drf-spectacular

Add pagination defaults

Add simple permissions: users can only see their own projects/moodboards

OUTPUT

Generate:

models

serializers

views

urls

settings updates

cloudinary config

JWT config

swagger config

Keep the code clean and minimal.