/**
 * Simple API Test Script for Task Management Backend
 * Run: node testAPI.js
 */

const API_URL = 'http://localhost:3000';

async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('Starting API tests...\n');

  // Create task
  console.log('1. Creating a task');
  let result = await request('POST', '/tasks', { title: 'Learn Node.js' });
  console.log(result);

  // Get tasks
  console.log('\n2. Fetching all tasks');
  result = await request('GET', '/tasks');
  console.log(result);

  // Update task
  console.log('\n3. Updating task');
  result = await request('PUT', '/tasks/1', { completed: true });
  console.log(result);

  // Delete task
  console.log('\n4. Deleting task');
  result = await request('DELETE', '/tasks/1');
  console.log(result);

  console.log('\nAPI tests completed');
}

runTests();
