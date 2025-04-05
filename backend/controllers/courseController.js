const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Submission = require('../models/Submission');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate({
        path: 'instructorId',
        select: 'name'
      });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'instructorId',
        select: 'name'
      })
      .populate({
        path: 'lessons',
        select: 'title order duration isPublished'
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

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

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Instructor
exports.createCourse = async (req, res) => {
  try {
    // Add instructor to course
    req.body.instructorId = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Make sure user is course instructor
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Make sure user is course instructor
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

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

// @desc    Get course lessons
// @route   GET /api/courses/:courseId/lessons
// @access  Private
exports.getLessons = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: 'lessons',
      select: 'title content videoUrl duration order isPublished',
      options: { sort: { order: 1 } }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      count: course.lessons.length,
      data: course.lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new lesson
// @route   POST /api/courses/:courseId/lessons
// @access  Private/Instructor
exports.createLesson = async (req, res) => {
  try {
    req.body.courseId = req.params.courseId;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Make sure user is course instructor
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to add lessons to this course'
      });
    }

    const lesson = await Lesson.create(req.body);

    // Add lesson to course
    await Course.findByIdAndUpdate(req.params.courseId, {
      $push: { lessons: lesson._id }
    });

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update lesson
// @route   PUT /api/courses/:courseId/lessons/:lessonId
// @access  Private/Instructor
exports.updateLesson = async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    const course = await Course.findById(req.params.courseId);

    // Make sure user is course instructor
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update lessons in this course'
      });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/:courseId/lessons/:lessonId
// @access  Private/Instructor
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    const course = await Course.findById(req.params.courseId);

    // Make sure user is course instructor
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete lessons from this course'
      });
    }

    await lesson.deleteOne();

    // Remove lesson from course
    await Course.findByIdAndUpdate(req.params.courseId, {
      $pull: { lessons: req.params.lessonId }
    });

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

// @desc    Get lesson quiz
// @route   GET /api/courses/:courseId/lessons/:lessonId/quiz
// @access  Private
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create quiz
// @route   POST /api/courses/:courseId/lessons/:lessonId/quiz
// @access  Private/Instructor
exports.createQuiz = async (req, res) => {
  try {
    req.body.lessonId = req.params.lessonId;

    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    const course = await Course.findById(req.params.courseId);
    // Make sure user is course instructor
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to add quiz to this lesson'
      });
    }

    const quiz = await Quiz.create(req.body);

    // Add quiz reference to lesson
    await Lesson.findByIdAndUpdate(req.params.lessonId, {
      quizId: quiz._id
    });

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/courses/:courseId/lessons/:lessonId/quiz
// @access  Private/Instructor
exports.updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findOne({ lessonId: req.params.lessonId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    const course = await Course.findById(req.params.courseId);
    // Make sure user is course instructor
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update quiz in this lesson'
      });
    }

    quiz = await Quiz.findByIdAndUpdate(quiz._id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/courses/:courseId/lessons/:lessonId/quiz
// @access  Private/Instructor
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    const course = await Course.findById(req.params.courseId);
    // Make sure user is course instructor
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete quiz from this lesson'
      });
    }

    await quiz.deleteOne();

    // Remove quiz reference from lesson
    await Lesson.findByIdAndUpdate(req.params.lessonId, {
      $unset: { quizId: "" }
    });

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

// @desc    Submit quiz
// @route   POST /api/courses/:courseId/lessons/:lessonId/quiz/submit
// @access  Private
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    // Calculate score
    let score = 0;
    const answers = req.body.answers;
    
    answers.forEach((answer, index) => {
      if (answer.selectedAnswer === quiz.questions[index].correctAnswer) {
        score += quiz.questions[index].points;
      }
    });

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentageScore = (score / totalPoints) * 100;
    const passed = percentageScore >= quiz.passingScore;

    // Create submission
    const submission = await Submission.create({
      studentId: req.user.id,
      quizId: quiz._id,
      answers,
      score,
      percentageScore,
      passed,
      timeSpent: req.body.timeSpent
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get course progress
// @route   GET /api/courses/:courseId/progress
// @access  Private
exports.getCourseProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId).populate('lessons');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter(lesson => 
      user.completedLessons.includes(lesson._id)
    ).length;

    const progress = {
      totalLessons,
      completedLessons,
      percentageCompleted: (completedLessons / totalLessons) * 100
    };

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Generate certificate
// @route   GET /api/courses/:courseId/certificate
// @access  Private
exports.generateCertificate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId).populate('lessons');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check if all lessons are completed
    const allLessonsCompleted = course.lessons.every(lesson =>
      user.completedLessons.includes(lesson._id)
    );

    if (!allLessonsCompleted) {
      return res.status(400).json({
        success: false,
        error: 'Complete all lessons to get certificate'
      });
    }

    // Check if certificate already exists
    const certificateExists = user.certificates.find(
      cert => cert.courseId.toString() === course._id.toString()
    );

    if (certificateExists) {
      return res.status(400).json({
        success: false,
        error: 'Certificate already generated'
      });
    }

    // Generate certificate URL (implement your certificate generation logic here)
    const certificateUrl = `certificates/${course._id}_${user._id}.pdf`;

    // Add certificate to user
    const certificate = {
      courseId: course._id,
      certificateUrl
    };

    await User.findByIdAndUpdate(req.user.id, {
      $push: { certificates: certificate }
    });

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 