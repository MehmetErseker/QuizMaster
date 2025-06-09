import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';

function QuizPlay() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx]             = useState(0); 
  const [sending, setSending]     = useState(false);

  
  useEffect(() => {
    const q = JSON.parse(sessionStorage.getItem('currentQuiz') || '[]');
    if (q.length !== 10) {
      navigate('/quiz-home');
    } else {
      setQuestions(q);
    }
  }, [navigate]);

  const answerQuestion = async (answer) => {
    if (sending) return;
    setSending(true);
    try {
      await fetch('http://localhost:3001/quiz/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questions[idx].id,
          answer
        }),
      });
    } catch (_) {
    } finally {
      setSending(false);
    }

    if (idx === 9) {
      const res = await fetch('http://localhost:3001/quiz/finish', {
        credentials: 'include',
      });
      const data = await res.json();
      sessionStorage.removeItem('currentQuiz');
      navigate('/quiz-result', { state: { score: data.totalScore } });
    } else {
      setIdx(idx + 1);
    }
  };

  if (!questions.length) return null;

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
