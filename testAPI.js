/**
 * Simple API Test Script
 * Run: node testAPI.js
 */

const API_URL = 'http://localhost:3000';

let teacherToken = '';
let studentToken = '';
let teacherId = '';
let studentId = '';
let assignmentId = '';

async function makeRequest(method, endpoint, body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Request Error:', error);
    return { status: 0, data: null };
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  // Test 1: Register Teacher
  console.log('1️  Registering Teacher...');
  let result = await makeRequest('POST', '/api/auth/register', {
    name: 'Ms. Jane Smith',
    email: 'jane@test.com',
    password: 'password123',
    role: 'teacher',
  });
  if (result.status === 201) {
    teacherToken = result.data.token;
    teacherId = result.data.user.id;
    console.log(' Teacher registered successfully');
    console.log(`   Token: ${teacherToken.substring(0, 20)}...`);
  } else {
    console.log(' Failed to register teacher');
    console.log('   Response:', result.data);
  }

  // Test 2: Register Student
  console.log('\n2️ Registering Student...');
  result = await makeRequest('POST', '/api/auth/register', {
    name: 'John Doe',
    email: 'john@test.com',
    password: 'password123',
    role: 'student',
  });
  if (result.status === 201) {
    studentToken = result.data.token;
    studentId = result.data.user.id;
    console.log(' Student registered successfully');
    console.log(`   Token: ${studentToken.substring(0, 20)}...`);
  } else {
    console.log(' Failed to register student');
    console.log('   Response:', result.data);
  }

  // Test 3: Create Assignment
  console.log('\n3️  Creating Assignment...');
  result = await makeRequest(
    'POST',
    '/api/assignments',
    {
      title: 'Math Homework Chapter 5',
      description: 'Complete all exercises from the chapter',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: studentId,
      createdBy: teacherId,
    },
    teacherToken
  );
  if (result.status === 201) {
    assignmentId = result.data.data._id;
    console.log(' Assignment created successfully');
    console.log(`   Assignment ID: ${assignmentId}`);
    console.log(`   Title: ${result.data.data.title}`);
  } else {
    console.log(' Failed to create assignment');
    console.log('   Response:', result.data);
  }

  // Test 4: Get All Assignments
  console.log('\n4️ Fetching All Assignments...');
  result = await makeRequest('GET', '/api/assignments', null, teacherToken);
  if (result.status === 200) {
    console.log('Assignments fetched successfully');
    console.log(`   Total: ${result.data.total}`);
    console.log(`   Count: ${result.data.count}`);
  } else {
    console.log('Failed to fetch assignments');
  }

  // Test 5: Student Submit Assignment
  if (assignmentId) {
    console.log('\n5️ Student Submitting Assignment...');
    result = await makeRequest(
      'POST',
      '/api/submissions',
      {
        assignmentId,
        studentId,
        content: 'Here is my complete solution to all the math problems...',
      },
      studentToken
    );
    if (result.status === 201) {
      const submissionId = result.data.data._id;
      console.log(' Assignment submitted successfully');
      console.log(`   Submission ID: ${submissionId}`);

      // Test 6: Teacher Grade Submission
      console.log('\n6️ Teacher Grading Submission...');
      result = await makeRequest(
        'PUT',
        `/api/submissions/${submissionId}`,
        {
          grade: 95,
          feedback:
            'Excellent work! All solutions are correct. Very well done!',
        },
        teacherToken
      );
      if (result.status === 200) {
        console.log('Submission graded successfully');
        console.log(`   Grade: ${result.data.data.grade}/100`);
        console.log(`   Feedback: ${result.data.data.feedback}`);
      } else {
        console.log(' Failed to grade submission');
      }
    } else {
      console.log(' Failed to submit assignment');
      console.log('   Response:', result.data);
    }
  }

  // Test 7: Get All Users
  console.log('\n7️ Fetching All Users...');
  result = await makeRequest('GET', '/api/users', null, teacherToken);
  if (result.status === 200) {
    console.log('Users fetched successfully');
    console.log(`   Total Users: ${result.data.total}`);
  } else {
    console.log('Failed to fetch users');
  }

  // Test 8: Health Check
  console.log('\n8️ Health Check...');
  result = await makeRequest('GET', '/api/health');
  if (result.status === 200) {
    console.log(' Server is healthy');
    console.log(`   Status: ${result.data.status}`);
  } else {
    console.log(' Server health check failed');
  }

  console.log('\n Tests completed!\n');
}

// Run tests
runTests();

