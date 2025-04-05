# API Endpoints Documentation

## Authentication Routes
Base URL: `/api/auth`

### Register User
- **Method**: POST
- **Endpoint**: `/register`
- **Access**: Public
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "student|instructor|admin" // Optional, defaults to "student"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN"
  }
  ```

### Login User
- **Method**: POST
- **Endpoint**: `/login`
- **Access**: Public
- **Description**: Authenticate user and get token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN"
  }
  ```

### Logout User
- **Method**: GET
- **Endpoint**: `/logout`
- **Access**: Private
- **Description**: Log user out and clear cookie
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

### Get Current User
- **Method**: GET
- **Endpoint**: `/me`
- **Access**: Private
- **Description**: Get current logged in user details
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "enrolledCourses": [],
      "completedLessons": [],
      "certificates": []
    }
  }
  ```

### Forgot Password
- **Method**: POST
- **Endpoint**: `/forgotpassword`
- **Access**: Public
- **Description**: Generate password reset token
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": "Email sent"
  }
  ```

### Reset Password
- **Method**: PUT
- **Endpoint**: `/resetpassword/:resettoken`
- **Access**: Public
- **Description**: Reset user password using token
- **Request Body**:
  ```json
  {
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN"
  }
  ```

### Update User Details
- **Method**: PUT
- **Endpoint**: `/updatedetails`
- **Access**: Private
- **Description**: Update logged in user name and email
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

### Update Password
- **Method**: PUT
- **Endpoint**: `/updatepassword`
- **Access**: Private
- **Description**: Update logged in user password
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN"
  }
  ```

## Course Routes
Base URL: `/api/courses`

### Get All Courses
- **Method**: GET
- **Endpoint**: `/`
- **Access**: Public
- **Description**: Get all courses with pagination
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `search`: string
  - `category`: string
  - `sortBy`: string
  - `order`: asc|desc
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": "number",
    "pagination": {},
    "data": []
  }
  ```

### Get Single Course
- **Method**: GET
- **Endpoint**: `/:id`
- **Access**: Public
- **Description**: Get single course by ID
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "title": "string",
      "description": "string",
      "instructor": {},
      "lessons": [],
      "enrolledStudents": [],
      "ratings": [],
      "price": "number"
    }
  }
  ```

### Create Course
- **Method**: POST
- **Endpoint**: `/`
- **Access**: Private (Instructor/Admin)
- **Description**: Create new course
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "category": "string",
    "price": "number",
    "thumbnail": "file"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

### Update Course
- **Method**: PUT
- **Endpoint**: `/:id`
- **Access**: Private (Course Owner/Admin)
- **Description**: Update course details
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

### Delete Course
- **Method**: DELETE
- **Endpoint**: `/:id`
- **Access**: Private (Course Owner/Admin)
- **Description**: Delete course
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## Lesson Routes
Base URL: `/api/courses/:courseId/lessons`

### Get All Lessons
- **Method**: GET
- **Endpoint**: `/`
- **Access**: Private (Enrolled Students/Course Owner/Admin)
- **Description**: Get all lessons for a course
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": "number",
    "data": []
  }
  ```

### Create Lesson
- **Method**: POST
- **Endpoint**: `/`
- **Access**: Private (Course Owner/Admin)
- **Description**: Add lesson to course
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "video": "file",
    "duration": "number",
    "order": "number"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## Quiz Routes
Base URL: `/api/courses/:courseId/quizzes`

### Get All Quizzes
- **Method**: GET
- **Endpoint**: `/`
- **Access**: Private (Enrolled Students/Course Owner/Admin)
- **Description**: Get all quizzes for a course
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": "number",
    "data": []
  }
  ```

### Submit Quiz
- **Method**: POST
- **Endpoint**: `/:quizId/submit`
- **Access**: Private (Enrolled Students)
- **Description**: Submit quiz answers
- **Request Body**:
  ```json
  {
    "answers": [
      {
        "questionId": "string",
        "selectedOption": "string"
      }
    ]
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "score": "number",
    "data": {}
  }
  ```

## Error Responses
All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Server Error"
}
``` 