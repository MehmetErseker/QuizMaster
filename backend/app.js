require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const axios = require('axios');
const Question = require('./models/questionModel');

const userRouter = require('./routes/userRoutes');
const quizRouter = require('./routes/quizRoutes');

const app = express();

const dbUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1/quizapp';
mongoose
  .connect(dbUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
mongoose.Promise = global.Promise;

async function loadQuestionsIfEmpty() {
  const count = await Question.countDocuments();
  if (count === 0) {
    console.log('No questions found. Loading from Open Trivia API...');
    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=50&type=multiple');
      const questions = res.data.results.map((q) => ({
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
        category: q.category,
        difficulty: q.difficulty,
        type: q.type,
      }));
      await Question.insertMany(questions);
      console.log(`${questions.length} questions loaded successfully!`);
    } catch (err) {
      console.error('Failed to load questions:', err.message);
    }
  } else {
    console.log(`Question DB already contains ${count} questions.`);
  }
}

loadQuestionsIfEmpty();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error('The CORS policy does not allow access from the specified Origin.'), false);
      }
      return callback(null, true);
    },
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'workhard',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: dbUrl,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/users', userRouter);
app.use('/quiz', quizRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, _next) => {
  const isDev = req.app.get('env') === 'development';
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      stack: isDev ? err.stack : undefined,
    },
  });
});

module.exports = app;
