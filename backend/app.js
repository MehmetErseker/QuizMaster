require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const axios = require('axios');
const Question = require('./models/questionModel');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRoutes');
const quizRouter = require('./routes/quizRoutes');

const app = express();


const dbUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1/quizapp';
mongoose.connect(dbUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
mongoose.Promise = global.Promise;


async function loadQuestionsIfEmpty() {
  const count = await Question.countDocuments();
  if (count === 0) {
    console.log('No questions found. Loading from Open Trivia API...');
    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=50&type=multiple');
      const questions = res.data.results.map(q => ({
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
        category: q.category,
        difficulty: q.difficulty,
        type: q.type
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
app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


app.use(session({
  secret: process.env.SESSION_SECRET || 'workhard',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: dbUrl,
    mongooseConnection: mongoose.connection 
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/quiz', quizRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.json({
    error: {
      message: res.locals.message,
      stack: res.locals.error.stack || undefined
    }
  });
});

module.exports = app;



