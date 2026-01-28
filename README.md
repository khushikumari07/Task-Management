-----Task Management Backend API------

Overview

This project is a simple backend REST API built using Node.js and Express.js.
It provides basic task management functionality such as creating, viewing, updating, and deleting tasks.
The project is designed to demonstrate a clear understanding of backend fundamentals and RESTful API design.


----Features-----

1. Create a new task
2. Retrieve all tasks
3. Update an existing task
4. Delete a task
5. Simple in-memory data storage (no database dependency)


----Technologies Used---

Node.js
Express.js
JavaScript
Postman (for API testing)

-----Project Structure---

Task-Management-Backend-API/
│
├── index.js
├── package.json
├── package-lock.json
└── README.md


----API Endpoints---
1. Create Task

POST /api/tasks
Creates a new task.

2. Get All Tasks

GET /api/tasks
Fetches all existing tasks.

3. Update Task

PUT /api/tasks/:id
Updates a task by its ID.

4. Delete Task

DELETE /api/tasks/:id
Deletes a task by its ID.


---How to Run the Project--

1. Clone the repository
git clone <repository-url>

2. Navigate to the project folder
cd Task-Management-Backend-API

3. Install dependencies
npm install

4. Start the server
node index.js

5. The server will run on:
http://localhost:3000




----Notes------

This project uses in-memory storage, so data will reset when the server restarts.
The implementation focuses on clarity and core backend concepts as required by the assignment.


