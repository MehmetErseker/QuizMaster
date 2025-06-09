
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizAttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    answer: String,
    correctAnswer: String,
    grade: Number,
    time: Number,
    score: Number
  }],
  totalScore: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
