const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getCourseProgress,
  generateCertificate
} = require('../controllers/courseController');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.use(protect);

// Instructor routes
router.use(authorize('instructor', 'admin'));
router.route('/')
  .post(createCourse);

router.route('/:id')
  .put(updateCourse)
  .delete(deleteCourse);

// Lesson routes
router.route('/:courseId/lessons')
  .get(getLessons)
  .post(createLesson);

router.route('/:courseId/lessons/:lessonId')
  .put(updateLesson)
  .delete(deleteLesson);

// Quiz routes
router.route('/:courseId/lessons/:lessonId/quiz')
  .get(getQuiz)
  .post(createQuiz)
  .put(updateQuiz)
  .delete(deleteQuiz);

// Student routes
router.use(authorize('student', 'admin', 'instructor'));
router.post('/:courseId/lessons/:lessonId/quiz/submit', submitQuiz);
router.get('/:courseId/progress', getCourseProgress);
router.get('/:courseId/certificate', generateCertificate);

module.exports = router; 