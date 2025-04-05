const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a lesson title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add lesson content']
  },
  videoUrl: {
    type: String
  },
  duration: {
    type: Number,
    required: [true, 'Please add lesson duration in minutes']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'file']
    },
    url: String
  }],
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

// Update course total duration when lesson is added or updated
lessonSchema.post('save', async function() {
  const Course = this.model('Course');
  const course = await Course.findById(this.courseId);
  
  if (course) {
    const lessons = await this.model('Lesson').find({ courseId: this.courseId });
    const totalDuration = lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
    
    await Course.findByIdAndUpdate(this.courseId, { totalDuration });
  }
});

module.exports = mongoose.model('Lesson', lessonSchema); 