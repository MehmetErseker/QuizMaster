import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuestionCard from './QuestionCard';

function QuizPlay() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const q = JSON.parse(sessionStorage.getItem('currentQuiz') || '[]');
    if (q.length !== 10) {
      navigate('/quiz-home');
      return;
    }
    setQuestions(q);
  }, [navigate]);

  const answerQuestion = async (answer) => {
    if (sending) {
      return;
    }

    setSending(true);
    try {
      await axios.post('/quiz/submit', {
        questionId: questions[idx].id,
        answer,
      });
    } catch (_) {
    } finally {
      setSending(false);
    }

    if (idx === 9) {
      const { data } = await axios.get('/quiz/finish');
      sessionStorage.removeItem('currentQuiz');
      navigate('/quiz-result', { state: { score: data.totalScore } });
      return;
    }

    setIdx((prev) => prev + 1);
  };

  if (!questions.length) {
    return null;
  }

  return (
    <QuestionCard
      q={questions[idx]}
      index={idx}
      total={questions.length}
      onAnswer={answerQuestion}
    />
  );
}

export default QuizPlay;
