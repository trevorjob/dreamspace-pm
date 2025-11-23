# DreamSpace PM - Django Backend

✅ **Build Complete!** 

A Django REST Framework backend for a project management and moodboard tool for interior decorators.

## 📁 Project Structure

```
server/
├── project/              # Django project settings
│   ├── settings.py      # Main configuration
│   ├── urls.py          # Root URL routing
│   └── wsgi.py          # WSGI configuration
├── api/                 # Main API app
│   ├── users/           # User authentication & profiles
│   ├── projects/        # Projects and Tasks
│   ├── moodboards/      # Moodboards and Items
│   ├── vendors/         # Vendors and Products
│   ├── admin.py         # Django admin configuration
│   └── urls.py          # API URL routing
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── db.sqlite3          # SQLite database
```

## 🚀 What's Built

### ✅ Completed Features

1. **Modular App Structure**: Organized into `users`, `projects`, `moodboards`, and `vendors` modules
2. **Custom User Model**: Extended Django's User model with phone field
3. **JWT Authentication**: Token-based authentication using SimpleJWT
4. **CORS Configuration**: Ready for Next.js frontend integration
5. **Cloudinary Integration**: File upload support for images
6. **REST API Endpoints**: Full CRUD operations for all models
7. **Django Admin**: Customized admin interface for all models

### 📋 Available Models

- **User**: Custom user model with authentication
- **Project**: Project management (name, client, dates)
- **Task**: Tasks linked to projects (title, status, due_date)
- **Moodboard**: Moodboards belonging to projects
- **MoodboardItem**: Items in moodboards with positioning (x, y, width, height)
- **Vendor**: Vendor information (name, phone, website)
- **Product**: Products from vendors (name, price, image)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login/` - Get JWT tokens
- `POST /api/auth/refresh/` - Refresh access token

### Users
- `GET /api/users/` - List users
- `POST /api/users/` - Register new user
- `GET /api/users/me/` - Get current user profile
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Projects
- `GET /api/projects/` - List all projects (filtered by current user)
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}/` - Get project details
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

### Tasks
- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get task details
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

### Moodboards
- `GET /api/moodboards/` - List all moodboards
- `POST /api/moodboards/` - Create new moodboard
- `GET /api/moodboards/{id}/` - Get moodboard details
- `PUT /api/moodboards/{id}/` - Update moodboard
- `DELETE /api/moodboards/{id}/` - Delete moodboard

### Moodboard Items
- `GET /api/moodboard-items/` - List all moodboard items
- `POST /api/moodboard-items/` - Create new item
- `GET /api/moodboard-items/{id}/` - Get item details
- `PUT /api/moodboard-items/{id}/` - Update item (including position)
- `DELETE /api/moodboard-items/{id}/` - Delete item

### Vendors
- `GET /api/vendors/` - List all vendors
- `POST /api/vendors/` - Create new vendor
- `GET /api/vendors/{id}/` - Get vendor details
- `PUT /api/vendors/{id}/` - Update vendor
- `DELETE /api/vendors/{id}/` - Delete vendor

### Products
- `GET /api/products/` - List all products
- `POST /api/products/` - Create new product
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product

## ⚙️ Setup Instructions

### 1. Environment Setup

The virtual environment and dependencies are already installed. If you need to reinstall:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Update `.env` file with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Database is Ready

Migrations have been applied. The SQLite database is ready to use.

### 4. Create Admin User

```powershell
python manage.py createsuperuser
```

### 5. Run the Server

```powershell
python manage.py runserver
```

The API will be available at: `http://127.0.0.1:8000/api/`
Admin panel: `http://127.0.0.1:8000/admin/`

## 🔐 Authentication Flow

1. **Register**: `POST /api/users/` with username, email, password
2. **Login**: `POST /api/auth/login/` with username & password
3. **Get Tokens**: Receive `access` and `refresh` tokens
4. **Use Token**: Include in headers: `Authorization: Bearer <access_token>`
5. **Refresh**: Use `POST /api/auth/refresh/` with refresh token

## 📝 Example API Usage

### Register User
```bash
POST /api/users/
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure123",
  "password2": "secure123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Login
```bash
POST /api/auth/login/
{
  "username": "john_doe",
  "password": "secure123"
}
```

### Create Project
```bash
POST /api/projects/
Headers: Authorization: Bearer <token>
{
  "name": "Modern Living Room",
  "description": "Contemporary design for client",
  "client_name": "Jane Smith",
  "start_date": "2025-01-01",
  "end_date": "2025-03-31"
}
```

### Upload Moodboard Item
```bash
POST /api/moodboard-items/
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
{
  "moodboard": 1,
  "image": <file>,
  "x": 100,
  "y": 200,
  "width": 300,
  "height": 400
}
```

## 🛠️ Tech Stack

- **Django 5.0.1**: Web framework
- **Django REST Framework 3.14.0**: API framework
- **SimpleJWT 5.3.1**: JWT authentication
- **Cloudinary 1.40.0**: Image hosting
- **django-cors-headers 4.3.1**: CORS support
- **django-environ 0.11.2**: Environment variables
- **SQLite**: Database (local development)

## 📦 Next Steps

1. **Add Cloudinary Credentials**: Update `.env` file
2. **Create Superuser**: Access Django admin
3. **Test API**: Use Postman/Thunder Client to test endpoints
4. **Connect Frontend**: Use with Next.js or React frontend
5. **Deploy**: Consider PostgreSQL for production

## 🎯 Features Ready for Frontend Integration

- ✅ User registration and authentication
- ✅ JWT token-based auth
- ✅ CORS configured for localhost:3000 and localhost:5173
- ✅ Full CRUD operations
- ✅ Nested serializers (projects include tasks, moodboards include items, etc.)
- ✅ User-specific data filtering
- ✅ Image upload support via Cloudinary
- ✅ Pagination support (20 items per page)

## 📚 Additional Resources

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- Cloudinary Docs: https://cloudinary.com/documentation

## 🐛 Troubleshooting

**Issue**: Migrations not applying
```powershell
python manage.py makemigrations
python manage.py migrate
```

**Issue**: CORS errors
- Check CORS_ALLOWED_ORIGINS in settings.py
- Ensure frontend URL is included

**Issue**: Cloudinary upload fails
- Verify credentials in .env file
- Check Cloudinary dashboard for API limits

---

**Status**: ✅ Backend fully built and ready to use!
**Database**: ✅ Migrated and ready
**API**: ✅ All endpoints configured
**Authentication**: ✅ JWT ready
**File Upload**: ✅ Cloudinary integrated
