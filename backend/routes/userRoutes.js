const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserCourses,
  enrollInCourse,
  getCompletedLessons,
  getCertificates
} = require('../controllers/userController');

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Student routes (protected but no admin required)
router.use(authorize('student', 'admin'));
router.get('/my/courses', getUserCourses);
router.post('/my/courses/:courseId/enroll', enrollInCourse);
router.get('/my/completed-lessons', getCompletedLessons);
router.get('/my/certificates', getCertificates);

module.exports = router; 