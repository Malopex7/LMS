const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  timeLimit: {
    type: Number,
    required: [true, 'Please add a time limit in minutes']
  },
  passingScore: {
    type: Number,
    required: [true, 'Please add a passing score percentage'],
    min: [0, 'Passing score cannot be less than 0'],
    max: [100, 'Passing score cannot be more than 100']
  },
  questions: [{
    question: {
      type: String,
      required: [true, 'Please add a question']
    },
    options: [{
      type: String,
      required: [true, 'Please add options']
    }],
    correctAnswer: {
      type: Number,
      required: [true, 'Please specify the correct answer index']
    },
    points: {
      type: Number,
      default: 1
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  allowReattempt: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total points
quizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

module.exports = mongoose.model('Quiz', quizSchema); 