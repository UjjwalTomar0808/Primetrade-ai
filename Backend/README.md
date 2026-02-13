# Backend API Documentation

A scalable, secure Node.js/Express backend with JWT authentication, built for the Primetrade.ai Frontend Developer Internship Assignment.

## 🚀 Features

- **JWT-based Authentication** - Secure user signup/login
- **User Profile Management** - Fetch and update user profiles
- **Task Management (CRUD)** - Complete task operations with search & filter
- **MongoDB Integration** - Robust database connection
- **Security Best Practices** - Password hashing, validation, error handling
- **Scalable Architecture** - Organized folder structure for easy scaling

## 📁 Project Structure

```
backend/
├── config/
│   ├── db-config.js       # Database connection
│   └── env-config.js      # Environment variables
├── controllers/
│   ├── auth.controller.js # Authentication logic
│   ├── user.controller.js # User profile logic
│   └── task.controller.js # Task CRUD logic
├── helpers/
│   ├── password.helper.js # Password hashing & comparison
│   ├── jwt.helper.js      # JWT token generation & verification
│   ├── validation.helper.js # Input validation utilities
│   └── error.helper.js    # Error handling & responses
├── middleware/
│   ├── auth.middleware.js # JWT authentication middleware
│   └── index.js           # Global middleware
├── models/
│   ├── User.js            # User schema
│   └── Task.js            # Task schema
├── routes/
│   ├── auth.routes.js     # Authentication routes
│   ├── user.routes.js     # User profile routes
│   └── task.routes.js     # Task routes
├── .env                   # Environment variables
├── index.js               # Server entry point
└── package.json
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=8082
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## � API Documentation

### Quick Start with Postman

Import the **Postman Collection** for instant API testing:

📦 **File:** `Primetrade-AI-Backend.postman_collection.json`

**Features:**
- All endpoints pre-configured
- Auto-saves authentication tokens
- Example requests included
- Environment variables for easy switching

### Complete API Reference

📖 **Detailed Documentation:** [API_DOCS.md](./API_DOCS.md)

Includes:
- Full endpoint documentation
- Request/response examples
- Validation rules
- Error handling
- Authentication flow

## �📡 API Endpoints

### Authentication Routes (`/api/v1/auth`)

#### 1. Signup
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "",
      "bio": "",
      "role": "user",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### 4. Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

---

### User Routes (`/api/v1/users`)

**All routes require authentication header:**
```
Authorization: Bearer <token>
```

#### 1. Get Profile
```http
GET /api/v1/users/profile
```

#### 2. Update Profile
```http
PUT /api/v1/users/profile
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Full-stack developer",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### 3. Update Password
```http
PUT /api/v1/users/password
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

#### 4. Delete Account
```http
DELETE /api/v1/users/account
```

---

### Task Routes (`/api/v1/tasks`)

**All routes require authentication header:**
```
Authorization: Bearer <token>
```

#### 1. Get All Tasks
```http
GET /api/v1/tasks
GET /api/v1/tasks?status=pending
GET /api/v1/tasks?priority=high
GET /api/v1/tasks?search=meeting
GET /api/v1/tasks?sortBy=createdAt&order=desc
```

**Response:**
```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "count": 2,
    "tasks": [...]
  }
}
```

#### 2. Get Task by ID
```http
GET /api/v1/tasks/:id
```

#### 3. Create Task
```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-02-20",
  "tags": ["documentation", "urgent"]
}
```

#### 4. Update Task
```http
PUT /api/v1/tasks/:id
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "in-progress",
  "priority": "medium"
}
```

#### 5. Delete Task
```http
DELETE /api/v1/tasks/:id
```

#### 6. Get Task Statistics
```http
GET /api/v1/tasks/stats
```

**Response:**
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

## 🔒 Security Features

### Password Hashing (bcrypt)
- Passwords are hashed using bcrypt with 10 salt rounds
- Helper functions: `hashPassword()`, `comparePassword()`

### JWT Authentication
- Tokens expire in 7 days by default
- Middleware validates tokens on protected routes
- Helper functions: `generateToken()`, `verifyToken()`

### Input Validation
- Email format validation
- Password strength validation (min 6 characters)
- Name validation (2-50 characters)
- MongoDB ObjectId validation
- Input sanitization (trim, remove extra spaces)

### Error Handling
- Custom `ApiError` class for operational errors
- Global error handler middleware
- Handles Mongoose validation errors, duplicate keys, cast errors
- Handles JWT errors (invalid token, expired token)
- Structured error responses

## 📊 Data Models

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  avatar: String,
  bio: String (max 200 chars),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  timestamps: true
}
```

### Task Model
```javascript
{
  title: String (required, 3-100 chars),
  description: String (max 500 chars),
  status: String (enum: ['pending', 'in-progress', 'completed']),
  priority: String (enum: ['low', 'medium', 'high']),
  dueDate: Date,
  user: ObjectId (ref: User, required),
  tags: [String],
  completed: Boolean,
  completedAt: Date,
  timestamps: true
}
```

## 🎯 Helper Functions

### Password Helper
- `hashPassword(password)` - Hash plain text password
- `comparePassword(password, hashedPassword)` - Verify password

### JWT Helper
- `generateToken(payload, expiresIn)` - Create JWT token
- `verifyToken(token)` - Verify and decode token

### Validation Helper
- `isValidEmail(email)` - Validate email format
- `isValidPassword(password)` - Check password strength
- `isValidName(name)` - Validate name length
- `isValidObjectId(id)` - Validate MongoDB ObjectId
- `sanitizeInput(input)` - Clean user input

### Error Helper
- `ApiError` - Custom error class
- `successResponse()` - Standard success response
- `errorResponse()` - Standard error response
- `asyncHandler()` - Wrap async route handlers
- `errorHandler()` - Global error middleware
- `notFoundHandler()` - 404 error handler

## 🌐 CORS Configuration

CORS is enabled for the frontend application:
- Default origin: `http://localhost:3000`
- Credentials: enabled
- Configure via `CORS_ORIGIN` environment variable

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🧪 Testing

### Using Postman (Recommended)

1. **Import the Collection:**
   - Open Postman
   - Import `Primetrade-AI-Backend.postman_collection.json`
   - The collection includes all endpoints with example data

2. **Auto-Authentication:**
   - Login or Signup request automatically saves the JWT token
   - Token is auto-included in subsequent requests

3. **Test Workflow:**
   - Start with Authentication (Signup/Login)
   - Test User Profile endpoints
   - Create and manage Tasks
   - Try filters, search, and statistics

### Alternative Tools

- **Thunder Client** - VS Code extension
- **curl** - Command line
- **Frontend Application** - Integration testing

### Testing Checklist

✅ User signup and login  
✅ Profile update and password change  
✅ Create, read, update, delete tasks  
✅ Task filtering (status, priority)  
✅ Task search functionality  
✅ Task statistics  
✅ Error handling (invalid data, unauthorized access)  

## 📚 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - CORS middleware

## 🚀 Deployment

1. Set `NODE_ENV=production` in your production environment
2. Use a strong `JWT_SECRET`
3. Update `CORS_ORIGIN` to your frontend URL
4. Ensure MongoDB connection is secure
5. Consider using PM2 or similar for process management

## 👨‍💻 Author

Created for the **Primetrade.ai Frontend Developer Internship Assignment**

---

**Note:** This is a lightweight backend designed for scalability. The codebase is structured for easy extension and maintenance.
