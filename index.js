const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Import routes
const userRoutes = require('./routes/userRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '✓ Welcome to Task Management Backend API',
    version: '1.0.0',
    status: 'Server is running',
    documentation: {
      auth: '/api/auth',
      users: '/api/users',
      assignments: '/api/assignments',
      submissions: '/api/submissions',
    },
    baseUrl: `http://localhost:${PORT}`,
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✓ Task Management Backend API is running                      ║
║  📡 Server URL: http://localhost:${PORT}                           ║
║  🗄️  Database: MongoDB (connecting...)                          ║
║  🔐 JWT Authentication: Enabled                                ║
║  ✅ Press Ctrl+C to stop the server                            ║
╚════════════════════════════════════════════════════════════════╝

📚 API Documentation:
  - Homepage: GET /
  - Health Check: GET /api/health
  
🔐 Authentication Endpoints:
  - Register: POST /api/auth/register
  - Login: POST /api/auth/login
  
👥 User Endpoints:
  - Get All Users: GET /api/users (Protected)
  - Get User by ID: GET /api/users/:id (Protected)
  - Update User: PUT /api/users/:id (Protected)
  - Delete User: DELETE /api/users/:id (Protected)

📝 Assignment Endpoints:
  - Create Assignment: POST /api/assignments (Teacher/Admin)
  - Get All Assignments: GET /api/assignments (Protected)
  - Get Assignment by ID: GET /api/assignments/:id (Protected)
  - Update Assignment: PUT /api/assignments/:id (Teacher/Admin)
  - Delete Assignment: DELETE /api/assignments/:id (Teacher/Admin)

📤 Submission Endpoints:
  - Create Submission: POST /api/submissions (Student)
  - Get All Submissions: GET /api/submissions (Protected)
  - Get Submissions by Assignment: GET /api/submissions/assignment/:assignmentId
  - Grade Submission: PUT /api/submissions/:id (Teacher/Admin)
  - Delete Submission: DELETE /api/submissions/:id
  `);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;

