# API Testing Guide

This guide will help you test all the DreamSpace PM API endpoints.

## Prerequisites

1. **Server must be running** at `http://127.0.0.1:8000/`
2. **Create a superuser** (for admin access):
   ```powershell
   python manage.py createsuperuser
   ```

## Testing Tools

You can use any of these:
- **Django REST Framework Browseable API** (easiest - built-in)
- **VS Code Thunder Client** extension
- **Postman**
- **cURL**

---

## 1. Test User Registration

### Using Browseable API
1. Go to: http://127.0.0.1:8000/api/users/
2. Click "POST" button
3. Fill in the form:
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "TestPass123!",
     "password2": "TestPass123!",
     "first_name": "Test",
     "last_name": "User",
     "phone": "+1234567890"
   }
   ```
4. Click "POST"

### Using cURL
```powershell
curl -X POST http://127.0.0.1:8000/api/users/ `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+1234567890"
  }'
```

**Expected Response**: 201 Created with user data

---

## 2. Test Login (Get JWT Token)

### Using Browseable API
1. Go to: http://127.0.0.1:8000/api/auth/login/
2. Fill in credentials:
   ```json
   {
     "username": "testuser",
     "password": "TestPass123!"
   }
   ```
3. Click "POST"

### Using cURL
```powershell
curl -X POST http://127.0.0.1:8000/api/auth/login/ `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

**Expected Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Save the access token** - you'll need it for all subsequent requests!

---

## 3. Test Current User Info

### Using Browseable API
1. Go to: http://127.0.0.1:8000/api/users/me/
2. The page will ask you to log in (use the browseable API login)
3. After login, you'll see your user data

### Using cURL
```powershell
curl http://127.0.0.1:8000/api/users/me/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Expected Response**: Your user data

---

## 4. Test Project Creation

### Using Browseable API
1. Log in to the browseable API (top right corner)
2. Go to: http://127.0.0.1:8000/api/projects/
3. Click "POST"
4. Fill in the form:
   ```json
   {
     "name": "Modern Kitchen Renovation",
     "description": "Complete kitchen redesign with modern appliances",
     "client_name": "Jane Smith",
     "client_email": "jane@example.com",
     "client_phone": "+1987654321",
     "status": "planning",
     "budget": "45000.00",
     "start_date": "2025-02-01",
     "end_date": "2025-05-31"
   }
   ```

### Using cURL
```powershell
curl -X POST http://127.0.0.1:8000/api/projects/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Modern Kitchen Renovation",
    "description": "Complete kitchen redesign",
    "client_name": "Jane Smith",
    "client_email": "jane@example.com",
    "status": "planning",
    "budget": "45000.00",
    "start_date": "2025-02-01",
    "end_date": "2025-05-31"
  }'
```

**Expected Response**: 201 Created with project data including ID

---

## 5. Test Task Creation

### Using Browseable API
1. Go to: http://127.0.0.1:8000/api/tasks/
2. Fill in:
   ```json
   {
     "project": 1,
     "title": "Create initial design mockups",
     "description": "Design 3 kitchen layout options",
     "status": "todo",
     "priority": "high",
     "due_date": "2025-02-15"
   }
   ```

### Using cURL
```powershell
curl -X POST http://127.0.0.1:8000/api/tasks/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" `
  -H "Content-Type: application/json" `
  -d '{
    "project": 1,
    "title": "Create initial design mockups",
    "description": "Design 3 kitchen layout options",
    "status": "todo",
    "priority": "high",
    "due_date": "2025-02-15"
  }'
```

---

## 6. Test Moodboard Creation

### Using Browseable API
1. Go to: http://127.0.0.1:8000/api/moodboards/
2. Fill in:
   ```json
   {
     "project": 1,
     "name": "Kitchen Color Palette",
     "description": "Main colors and materials for kitchen"
   }
   ```

---

## 7. Test Vendor Creation

### Using Browseable API
1. Go to: http://127.0.0.1:8000/api/vendors/
2. Fill in:
   ```json
   {
     "name": "Modern Fixtures Inc",
     "description": "Supplier of modern kitchen fixtures",
     "website": "https://modernfixtures.com",
     "contact_email": "sales@modernfixtures.com",
     "contact_phone": "+1555123456"
   }
   ```

---

## 8. Test Product Creation

### Using Browseable API
1. Go to: http://127.0.0.1:8000/api/products/
2. Fill in:
   ```json
   {
     "vendor": 1,
     "name": "Brushed Nickel Faucet",
     "description": "Modern pull-down kitchen faucet",
     "category": "fixtures",
     "price": "299.99",
     "url": "https://modernfixtures.com/faucets/brushed-nickel"
   }
   ```

---

## 9. Test List Operations

### Get all projects
```powershell
curl http://127.0.0.1:8000/api/projects/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get all tasks
```powershell
curl http://127.0.0.1:8000/api/tasks/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get all moodboards
```powershell
curl http://127.0.0.1:8000/api/moodboards/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 10. Test Update Operations

### Update a project (PUT)
```powershell
curl -X PUT http://127.0.0.1:8000/api/projects/1/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Modern Kitchen Renovation - Updated",
    "status": "in_progress"
  }'
```

### Update a task status (PATCH)
```powershell
curl -X PATCH http://127.0.0.1:8000/api/tasks/1/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" `
  -H "Content-Type: application/json" `
  -d '{
    "status": "in_progress"
  }'
```

---

## 11. Test Delete Operations

### Delete a task
```powershell
curl -X DELETE http://127.0.0.1:8000/api/tasks/1/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Expected Response**: 204 No Content

---

## 12. Test Image Upload (Moodboard Item)

### Using Browseable API
1. Go to: http://127.0.0.1:8000/api/moodboard-items/
2. Use the HTML form to:
   - Select moodboard
   - Upload an image file
   - Fill in title, x, y, width, height
3. Click "POST"

### Using cURL with file
```powershell
curl -X POST http://127.0.0.1:8000/api/moodboard-items/ `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" `
  -F "moodboard=1" `
  -F "image=@C:\path\to\image.jpg" `
  -F "title=Kitchen Inspiration" `
  -F "x=100" `
  -F "y=150" `
  -F "width=300" `
  -F "height=200"
```

---

## Admin Panel Testing

1. **Create superuser** (if not already done):
   ```powershell
   python manage.py createsuperuser
   ```

2. **Access admin panel**: http://127.0.0.1:8000/admin/

3. **Login** with superuser credentials

4. **Test admin features**:
   - View all users
   - Create/edit projects
   - Manage tasks
   - View moodboards
   - Manage vendors and products

---

## Quick Test Checklist

- [ ] Register a new user
- [ ] Login and get JWT token
- [ ] Get current user info (/me)
- [ ] Create a project
- [ ] List all projects
- [ ] Update a project
- [ ] Create a task for the project
- [ ] Update task status
- [ ] Create a moodboard
- [ ] Add item to moodboard (with image)
- [ ] Create a vendor
- [ ] Create a product
- [ ] Delete a task
- [ ] Access admin panel
- [ ] Test token refresh

---

## Common Status Codes

- **200 OK** - Request succeeded
- **201 Created** - Resource created
- **204 No Content** - Delete succeeded
- **400 Bad Request** - Invalid data
- **401 Unauthorized** - Not authenticated
- **403 Forbidden** - Not authorized
- **404 Not Found** - Resource doesn't exist

---

## Testing with Thunder Client (VS Code Extension)

1. **Install Thunder Client** extension in VS Code
2. **Create a new request**
3. **Set method** (GET, POST, PUT, PATCH, DELETE)
4. **Set URL**: `http://127.0.0.1:8000/api/...`
5. **Add header**: `Authorization: Bearer YOUR_TOKEN`
6. **Add body** (for POST/PUT/PATCH)
7. **Send request**

**Pro tip**: Save your requests in a collection for reuse!

---

## Next Steps After Testing

Once all tests pass:
1. ✅ Configure Cloudinary for production image hosting
2. ✅ Set up PostgreSQL for production database
3. ✅ Update CORS settings for your frontend domain
4. ✅ Add more custom endpoints as needed
5. ✅ Implement additional business logic
6. ✅ Add filtering and search capabilities
7. ✅ Set up production deployment (Heroku, Railway, etc.)

---

**Happy Testing! 🚀**
