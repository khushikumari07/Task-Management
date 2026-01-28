# Task Management Backend API Documentation

## 📋 Overview
A comprehensive RESTful API for managing assignments and tasks in an educational environment. Built with Node.js, Express, and MongoDB with JWT authentication.

## 🚀 Features
- ✅ **CRUD Operations** for Users, Assignments, and Submissions
- 🔐 **JWT Authentication** with role-based access control (Student, Teacher, Admin)
- 📚 **MongoDB Integration** with Mongoose ODM
- ✔️ **Input Validation** using Joi
- 🔍 **Pagination & Filtering** for large datasets
- 📊 **Assignment Status Tracking** (pending, submitted, graded)
- 🎓 **Grade Management** with feedback system
- ⏱️ **Late Submission Detection**

## 📁 Project Structure
```
Task Management Backend API/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── userController.js    # User CRUD operations
│   ├── assignmentController.js
│   └── submissionController.js
├── models/
│   ├── User.js
│   ├── Assignment.js
│   └── Submission.js
├── routes/
│   ├── userRoutes.js
│   ├── assignmentRoutes.js
│   └── submissionRoutes.js
├── middleware/
│   ├── auth.js              # JWT verification & authorization
│   └── validation.js        # Input validation schemas
├── index.js                 # Main server file
├── .env                     # Environment variables
└── package.json
```

## 🔧 Installation

### 1. Clone/Setup Project
```bash
cd "Task Management Backend API"
npm install
```

### 2. Configure Environment
Edit `.env` file with your MongoDB URI and JWT secret:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

### 3. Start Server
You can start the server using the npm script or directly with Node:

```bash
# using npm script
npm start

# directly with Node (same effect)
node index.js

# or, if your entry file is named server.js
node server.js
```

Server runs on http://localhost:3000

## 🌐 API Endpoints

### 📱 Base URL
```
http://localhost:3000
```

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // student, teacher, admin
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "5f7f8c7c8c7c8c7c8c7c8c7c",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### 👥 User Endpoints (All require JWT token)

#### Get All Users
```http
GET /api/users?page=1&limit=10&role=student
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "5f7f8c7c8c7c8c7c8c7c8c7c",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "createdAt": "2024-01-28T10:30:00Z"
    }
  ]
}
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "role": "teacher"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

---

### 📝 Assignment Endpoints (All require JWT token)

#### Create Assignment (Teacher/Admin only)
```http
POST /api/assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Math Homework Chapter 5",
  "description": "Complete exercises 1-20 from chapter 5",
  "dueDate": "2024-02-05T23:59:59Z",
  "assignedTo": "5f7f8c7c8c7c8c7c8c7c8c7c",  // Student ID
  "createdBy": "5f7f8c7c8c7c8c7c8c7c8c7d"    // Teacher ID
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "5f7f8c7c8c7c8c7c8c7c8c7e",
    "title": "Math Homework Chapter 5",
    "description": "Complete exercises 1-20 from chapter 5",
    "dueDate": "2024-02-05T23:59:59Z",
    "status": "pending",
    "assignedTo": {
      "_id": "5f7f8c7c8c7c8c7c8c7c8c7c",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdBy": {
      "_id": "5f7f8c7c8c7c8c7c8c7c8c7d",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  }
}
```

#### Get All Assignments
```http
GET /api/assignments?page=1&limit=10&status=pending&sortBy=-dueDate
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, submitted, graded)
- `assignedTo` - Filter by student ID
- `createdBy` - Filter by teacher ID
- `sortBy` - Sort by field (-dueDate, createdAt, etc.)

#### Get Assignment by ID
```http
GET /api/assignments/:id
Authorization: Bearer <token>
```

#### Update Assignment (Teacher/Admin only)
```http
PUT /api/assignments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "graded",
  "dueDate": "2024-02-10T23:59:59Z"
}
```

#### Delete Assignment (Teacher/Admin only)
```http
DELETE /api/assignments/:id
Authorization: Bearer <token>
```

---

### 📤 Submission Endpoints (All require JWT token)

#### Create Submission (Student only)
```http
POST /api/submissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignmentId": "5f7f8c7c8c7c8c7c8c7c8c7e",
  "studentId": "5f7f8c7c8c7c8c7c8c7c8c7c",
  "content": "Here is my solution to the math problems..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "5f7f8c7c8c7c8c7c8c7c8c7f",
    "assignmentId": "5f7f8c7c8c7c8c7c8c7c8c7e",
    "studentId": "5f7f8c7c8c7c8c7c8c7c8c7c",
    "content": "Here is my solution...",
    "submissionDate": "2024-01-28T14:30:00Z",
    "isLate": false,
    "grade": null,
    "feedback": null
  }
}
```

#### Get All Submissions
```http
GET /api/submissions?page=1&limit=10&studentId=5f7f8c7c8c7c8c7c8c7c8c7c
Authorization: Bearer <token>
```

#### Get Submissions by Assignment
```http
GET /api/submissions/assignment/:assignmentId?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Submission by ID
```http
GET /api/submissions/:submissionId
Authorization: Bearer <token>
```

#### Grade Submission (Teacher/Admin only)
```http
PUT /api/submissions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "grade": 85,
  "feedback": "Excellent work! You solved all problems correctly. Well done!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Submission graded successfully",
  "data": {
    "_id": "5f7f8c7c8c7c8c7c8c7c8c7f",
    "grade": 85,
    "feedback": "Excellent work!...",
    "updatedAt": "2024-01-28T15:00:00Z"
  }
}
```

#### Delete Submission
```http
DELETE /api/submissions/:id
Authorization: Bearer <token>
```

---

## 🔑 Data Models

### User Model
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "password": "String (hashed)",
  "role": "String (student|teacher|admin)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Assignment Model
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "dueDate": "Date",
  "status": "String (pending|submitted|graded)",
  "assignedTo": "ObjectId (User reference)",
  "createdBy": "ObjectId (User reference)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Submission Model
```json
{
  "_id": "ObjectId",
  "assignmentId": "ObjectId (Assignment reference)",
  "studentId": "ObjectId (User reference)",
  "content": "String",
  "submissionDate": "Date",
  "grade": "Number (0-100)",
  "feedback": "String",
  "isLate": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 🔐 Authentication & Authorization

### JWT Token
After login/register, use the token in all protected endpoints:
```http
Authorization: Bearer <your_token_here>
```

### Role-Based Access Control (RBAC)
- **Student**: Can create submissions, view own assignments
- **Teacher**: Can create/grade assignments, view submissions
- **Admin**: Full access to all resources

---

## ✔️ Input Validation

### User Registration
- `name`: String (min 3 characters)
- `email`: Valid email format
- `password`: String (min 6 characters)
- `role`: One of [student, teacher, admin]

### Assignment Creation
- `title`: String (min 3 characters)
- `description`: String (min 10 characters)
- `dueDate`: Valid date
- `assignedTo`: Valid user ID
- `createdBy`: Valid user ID

### Submission Creation
- `assignmentId`: Valid assignment ID
- `studentId`: Valid student ID
- `content`: String (min 10 characters)

### Grading
- `grade`: Number (0-100)
- `feedback`: String (min 5 characters)

---

## 🧪 Testing with cURL

### Register a Teacher
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "teacher"
  }'
```

### Register a Student
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Create Assignment
```bash
curl -X POST http://localhost:3000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Math Homework",
    "description": "Complete all exercises",
    "dueDate": "2024-02-10T23:59:59Z",
    "assignedTo": "STUDENT_ID",
    "createdBy": "TEACHER_ID"
  }'
```

---

## ⚠️ Error Handling

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "message": "Validation error details"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message"
}
```

---

## 🔄 Workflow Example

### Teacher Assigns Homework
1. Teacher registers/logs in
2. Teacher creates assignment with student ID
3. Assignment status: **pending**

### Student Submits Assignment
1. Student logs in
2. Student creates submission for assignment
3. Assignment status: **submitted**

### Teacher Grades Assignment
1. Teacher gets all submissions for assignment
2. Teacher grades submission with grade & feedback
3. Assignment status: **graded**

---

## 🚀 Production Deployment

Before deploying to production:
1. Change `JWT_SECRET` to a strong random string
2. Update `MONGODB_URI` with your production MongoDB instance
3. Set `NODE_ENV=production`
4. Enable CORS for your frontend domain only
5. Add rate limiting
6. Use HTTPS/SSL
7. Add request logging
8. Enable helmet for security headers

---

## 📝 License
ISC

---

## 💡 Future Enhancements
- [ ] Email notifications for assignments/grades
- [ ] File upload support for submissions
- [ ] Assignment categories/subjects
- [ ] Student performance analytics
- [ ] Plagiarism detection
- [ ] Real-time notifications with WebSocket
- [ ] Export grades to CSV
- [ ] Mobile app integration
