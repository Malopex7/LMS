const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean,
    points: Number
  }],
  score: {
    type: Number,
    required: true
  },
  percentageScore: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent multiple submissions if quiz doesn't allow reattempts
submissionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Quiz = this.model('Quiz');
    const quiz = await Quiz.findById(this.quizId);
    
    if (!quiz.allowReattempt) {
      const existingSubmission = await this.model('Submission').findOne({
        studentId: this.studentId,
        quizId: this.quizId
      });
      
      if (existingSubmission) {
        throw new Error('Quiz reattempts are not allowed');
      }
    }
  }
  next();
});

// Update user's completed lessons if passed
submissionSchema.post('save', async function() {
  const Quiz = this.model('Quiz');
  const User = this.model('User');
  
  const quiz = await Quiz.findById(this.quizId);
  if (this.passed && quiz) {
    await User.findByIdAndUpdate(
      this.studentId,
      {
        $addToSet: { completedLessons: quiz.lessonId }
      }
    );
  }
});

module.exports = mongoose.model('Submission', submissionSchema); 