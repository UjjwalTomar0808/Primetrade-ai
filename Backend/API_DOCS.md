# 📡 API Documentation

Complete API documentation for the Primetrade.ai Backend API.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [User Profile](#user-profile)
- [Tasks](#tasks)
- [Error Handling](#error-handling)
- [Status Codes](#status-codes)

---

## 🚀 Getting Started

### Base URL
```
http://localhost:8082
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

### Postman Collection
Import the `Primetrade-AI-Backend.postman_collection.json` file into Postman for easy testing.

---

## 🔐 Authentication

### 1. Signup

Create a new user account.

**Endpoint:** `POST /api/v1/auth/signup`  
**Auth Required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "",
      "bio": "",
      "role": "user",
      "createdAt": "2026-02-10T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `name`: 2-50 characters, required
- `email`: Valid email format, unique, required
- `password`: Minimum 6 characters, required

---

### 2. Login

Authenticate an existing user.

**Endpoint:** `POST /api/v1/auth/login`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "",
      "bio": "",
      "role": "user",
      "createdAt": "2026-02-10T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User

Get the authenticated user's information.

**Endpoint:** `GET /api/v1/auth/me`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "",
      "bio": "",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-02-10T10:30:00.000Z",
      "updatedAt": "2026-02-10T10:30:00.000Z"
    }
  }
}
```

---

### 4. Logout

Logout the current user (client-side token removal).

**Endpoint:** `POST /api/v1/auth/logout`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 👤 User Profile

### 1. Get Profile

Get the authenticated user's profile.

**Endpoint:** `GET /api/v1/users/profile`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "",
      "bio": "",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-02-10T10:30:00.000Z",
      "updatedAt": "2026-02-10T10:30:00.000Z"
    }
  }
}
```

---

### 2. Update Profile

Update user profile information.

**Endpoint:** `PUT /api/v1/users/profile`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "John Updated",
  "bio": "Full-stack developer passionate about AI",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Updated",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Full-stack developer passionate about AI",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-02-10T10:30:00.000Z",
      "updatedAt": "2026-02-10T11:00:00.000Z"
    }
  }
}
```

**Validation Rules:**
- `name`: 2-50 characters (optional)
- `bio`: Max 200 characters (optional)
- `avatar`: URL string (optional)

---

### 3. Update Password

Change user password.

**Endpoint:** `PUT /api/v1/users/password`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Validation Rules:**
- `currentPassword`: Required
- `newPassword`: Minimum 6 characters, required

---

### 4. Delete Account

Delete user account and all associated data.

**Endpoint:** `DELETE /api/v1/users/account`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

⚠️ **Warning:** This action is irreversible and will delete all user tasks.

---

## 📝 Tasks

### 1. Get All Tasks

Get all tasks for the authenticated user with optional filters.

**Endpoint:** `GET /api/v1/tasks`  
**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- `search` (optional): Search in title and description
- `sortBy` (optional): Sort field (default: `createdAt`)
- `order` (optional): Sort order (`asc` or `desc`, default: `desc`)

**Examples:**
```
GET /api/v1/tasks
GET /api/v1/tasks?status=pending
GET /api/v1/tasks?priority=high
GET /api/v1/tasks?search=meeting
GET /api/v1/tasks?status=pending&priority=high
GET /api/v1/tasks?sortBy=createdAt&order=desc
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "count": 2,
    "tasks": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "title": "Complete project documentation",
        "description": "Write comprehensive API docs",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2026-02-20T00:00:00.000Z",
        "user": "65a1b2c3d4e5f6g7h8i9j0k0",
        "tags": ["documentation", "urgent"],
        "completed": false,
        "completedAt": null,
        "createdAt": "2026-02-10T10:00:00.000Z",
        "updatedAt": "2026-02-10T11:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Task by ID

Get a specific task by its ID.

**Endpoint:** `GET /api/v1/tasks/:id`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task fetched successfully",
  "data": {
    "task": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-02-20T00:00:00.000Z",
      "user": "65a1b2c3d4e5f6g7h8i9j0k0",
      "tags": ["documentation", "urgent"],
      "completed": false,
      "completedAt": null,
      "createdAt": "2026-02-10T10:00:00.000Z",
      "updatedAt": "2026-02-10T11:00:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### 3. Create Task

Create a new task.

**Endpoint:** `POST /api/v1/tasks`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation and README",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-02-20",
  "tags": ["documentation", "urgent"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation and README",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-02-20T00:00:00.000Z",
      "user": "65a1b2c3d4e5f6g7h8i9j0k0",
      "tags": ["documentation", "urgent"],
      "completed": false,
      "completedAt": null,
      "createdAt": "2026-02-10T10:00:00.000Z",
      "updatedAt": "2026-02-10T10:00:00.000Z"
    }
  }
}
```

**Validation Rules:**
- `title`: 3-100 characters, required
- `description`: Max 500 characters, optional
- `status`: One of `pending`, `in-progress`, `completed` (default: `pending`)
- `priority`: One of `low`, `medium`, `high` (default: `medium`)
- `dueDate`: Valid date, optional
- `tags`: Array of strings, optional

---

### 4. Update Task

Update an existing task.

**Endpoint:** `PUT /api/v1/tasks/:id`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2026-02-25",
  "tags": ["updated", "in-progress"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Updated task title",
      "description": "Updated description",
      "status": "in-progress",
      "priority": "medium",
      "dueDate": "2026-02-25T00:00:00.000Z",
      "user": "65a1b2c3d4e5f6g7h8i9j0k0",
      "tags": ["updated", "in-progress"],
      "completed": false,
      "completedAt": null,
      "createdAt": "2026-02-10T10:00:00.000Z",
      "updatedAt": "2026-02-10T12:00:00.000Z"
    }
  }
}
```

**Mark as Completed:**
```json
{
  "status": "completed"
}
```
When status is set to `completed`, the `completedAt` field is automatically set to the current date.

---

### 5. Delete Task

Delete a task.

**Endpoint:** `DELETE /api/v1/tasks/:id`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### 6. Get Task Statistics

Get aggregated statistics for user's tasks.

**Endpoint:** `GET /api/v1/tasks/stats`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task statistics fetched successfully",
  "data": {
    "stats": {
      "total": 10,
      "pending": 3,
      "inProgress": 4,
      "completed": 3,
      "highPriority": 2,
      "mediumPriority": 5,
      "lowPriority": 3
    }
  }
}
```

---

## ⚠️ Error Handling

### Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Additional error details"]
}
```

### Common Error Scenarios

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Name must be at least 2 characters",
    "Email is required"
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "No token provided. Please login to access this resource"
}
```

**Authorization Error (403):**
```json
{
  "success": false,
  "message": "Account is deactivated. Please contact support"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Duplicate Entry (409):**
```json
{
  "success": false,
  "message": "Duplicate field value entered",
  "errors": ["email already exists"]
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate resource (e.g., email exists) |
| 500 | Internal Server Error - Server error |

---

## 🔒 Authentication Flow

1. **Signup/Login** → Receive JWT token
2. **Store token** → Save in client (localStorage, cookie, etc.)
3. **Use token** → Include in Authorization header for protected routes
4. **Token expiration** → Token expires in 7 days (default)
5. **Logout** → Remove token from client storage

**Authorization Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Testing Tips

1. **Start with Authentication:**
   - First, signup or login to get a token
   - Copy the token from the response

2. **Set Token in Postman:**
   - The collection includes a test script that auto-saves tokens
   - Or manually set `{{token}}` variable in Postman

3. **Test CRUD Operations:**
   - Create tasks → Read → Update → Delete
   - Try filters and search
   - Check statistics

4. **Test Error Cases:**
   - Try accessing protected routes without token
   - Submit invalid data
   - Try to access other users' tasks

---

## 📞 Support

For issues or questions, refer to the main [README.md](./README.md) documentation.

---

**Built for Primetrade.ai Frontend Developer Internship Assignment**
