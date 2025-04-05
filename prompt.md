Build a complete Learning Management System (LMS) using the MERN stack (MongoDB, Express.js, React.js, Node.js). Use Tailwind CSS for styling and layout. Do not use any CSS frameworks other than Tailwind. Use Redux Toolkit for state management.

Implement the following features:

1. **Authentication:**
   - Use JWT for authentication and authorization.
   - Roles: admin, instructor, student.
   - Store hashed passwords using bcrypt.
   - Protect routes using middleware based on roles.

2. **Backend (Node.js + Express):**
   - Set up RESTful API using Express.
   - Use MongoDB with Mongoose for schema modeling.
   - Organize code into controllers, models, routes, and middleware.
   - Implement file uploads using `multer` and store videos in Cloudinary.
   - Use Nodemailer for sending registration and course enrollment emails.
   - Do not use GraphQL.

3. **Database Models (MongoDB/Mongoose):**
   - User: name, email, password, role, enrolledCourses.
   - Course: title, description, instructorId, list of lessonIds, enrolledStudentIds.
   - Lesson: title, courseId, videoUrl, content, optional quizId.
   - Quiz: lessonId, array of questions, each with question, options, correctAnswer.
   - Submission: studentId, quizId, selectedAnswers, score.

4. **Frontend (React + Redux Toolkit):**
   - Use React Router DOM for navigation.
   - Tailwind CSS for styling and responsiveness.
   - Pages:
     - Register/Login
     - Admin Dashboard (manage users, courses)
     - Instructor Dashboard (create/edit courses, add lessons)
     - Student Dashboard (enrolled courses, progress)
     - Course view page with lessons and quizzes
     - Lesson view with embedded video and content
     - Quiz page with question-by-question form and scoring

5. **Role-Based Dashboards:**
   - Admin: user management, system stats.
   - Instructor: course & lesson management.
   - Student: enrolled courses, progress tracking, take quizzes.

6. **Quizzes:**
   - Timed quizzes per lesson.
   - Store submissions and compute score.
   - Block reattempts.

7. **Progress Tracking:**
   - Store completed lessons per student.
   - Show percentage completion per course.

8. **Certificates:**
   - Generate PDF certificates upon course completion using `html-pdf`.
   - Save certificate URL to student profile.
   - Email certificate as attachment with Nodemailer.

9. **Deployment:**
   - Backend: deploy on Render.
   - Frontend: deploy on Vercel.
   - MongoDB: use MongoDB Atlas.
   - Store .env variables for keys and secrets.

10. **Tech Stack Summary:**
   - Frontend: React, Redux Toolkit, Tailwind CSS, React Router DOM, Axios
   - Backend: Node.js, Express.js, MongoDB with Mongoose, Multer, Cloudinary SDK, Bcrypt, JWT, Nodemailer
   - Deployment: Render (backend), Vercel (frontend), MongoDB Atlas (database)

Code structure should follow best practices and be production-ready. Add proper loading states and error handling for all API calls. Ensure semantic HTML and accessibility where applicable.
