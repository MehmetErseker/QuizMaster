
const Question     = require('../models/questionModel');
const QuizAttempt  = require('../models/quizAttemptModel');


const getCurrentUserId = (req) =>
  req.user?.uid || req.session?.userId || null;


exports.startQuiz = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);

    
    req.session.quiz = questions.map((q) => ({
      questionId: q._id,
      startTime:  Date.now(),
    }));

    
    const payload = questions.map((q) => ({
      id:       q._id,
      question: q.question,
      options:  [...q.incorrect_answers, q.correct_answer].sort(
        () => Math.random() - 0.5
      ),
    }));

    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start quiz' });
  }
};


exports.submitAnswer = async (req, res) => {
  const { questionId, answer } = req.body;

  const sessionQ = req.session.quiz?.find(
    (q) => q.questionId.toString() === questionId
  );
  if (!sessionQ)
    return res.status(400).json({ error: 'Question not in session' });

  const elapsed = (Date.now() - sessionQ.startTime) / 1000;

  try {
    const question = await Question.findById(questionId);

    const grade  = answer === question.correct_answer ? 1 : 0;
    const n      = 100 * grade;
    const k      = 0.2;
    const score  = n * Math.exp(-k * elapsed);

    Object.assign(sessionQ, {
      answer,
      correctAnswer: question.correct_answer,
      grade,
      time:  elapsed,
      score,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
};

exports.finishQuiz = async (req, res) => {
  const results    = req.session.quiz || [];
  const totalScore = results.reduce((sum, q) => sum + (q.score || 0), 0);

  try {
    const userId = getCurrentUserId(req);  

    if (userId) {
      await QuizAttempt.create({
        userId,
        questions: results,
        totalScore,
      });
    }

    req.session.quiz = null;

    res.json({ message: 'Quiz finished', totalScore });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save quiz attempt' });
  }
};

exports.getLeaderboard = async (_req, res) => {
  try {
    const top = await QuizAttempt.find({})
      .sort({ totalScore: -1 })
      .limit(10)
      .populate('userId', 'username name avatar');
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const query = {};
    const userId = getCurrentUserId(req);
    if (userId) query.userId = userId;

    const attempts = await QuizAttempt.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'username name');

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load history' });
  }
};
