// routes/quizRoutes.js
const express = require('express');
const router  = express.Router();

const quizController   = require('../controllers/quizController');
const authenticateUser = require('../middleware/authMiddleware');


router.get('/leaderboard',          quizController.getLeaderboard);
router.get('/start',    authenticateUser, quizController.startQuiz);
router.post('/submit',  authenticateUser, quizController.submitAnswer);
router.get('/finish',   authenticateUser, quizController.finishQuiz);
router.get('/history',  authenticateUser, quizController.getHistory);


const Question = require('../models/questionModel');
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find().limit(50);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch questions' });
  }
});

module.exports = router;
