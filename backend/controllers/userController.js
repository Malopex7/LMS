const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/users/my/courses
// @access  Private
exports.getUserCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      select: 'title description thumbnail category level totalDuration',
      populate: {
        path: 'instructorId',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      count: user.enrolledCourses.length,
      data: user.enrolledCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Enroll in a course
// @route   POST /api/users/my/courses/:courseId/enroll
// @access  Private
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check if already enrolled
    const user = await User.findById(req.user.id);
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        error: 'Already enrolled in this course'
      });
    }

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: course._id }
    });

    // Add user to course's enrolled students
    await Course.findByIdAndUpdate(course._id, {
      $push: { enrolledStudents: req.user.id }
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user's completed lessons
// @route   GET /api/users/my/completed-lessons
// @access  Private
exports.getCompletedLessons = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'completedLessons',
        select: 'title courseId',
        populate: {
          path: 'courseId',
          select: 'title'
        }
      });

    res.status(200).json({
      success: true,
      count: user.completedLessons.length,
      data: user.completedLessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user's certificates
// @route   GET /api/users/my/certificates
// @access  Private
exports.getCertificates = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'certificates.courseId',
        select: 'title'
      });

    res.status(200).json({
      success: true,
      count: user.certificates.length,
      data: user.certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 