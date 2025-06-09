import './QuizResult.css';
import { useLocation, Link } from 'react-router-dom';

function QuizResult() {
  const { state } = useLocation();
  if (!state?.score) return <p>0</p>;

  return (
    <div className="quiz-result">
      <h2>Your total score</h2>
      <p className="score">{state.score.toFixed(2)}</p>
      <Link to="/quiz-home">Take another quiz</Link> |{' '}
      <Link to="/leaderboard">Leaderboard</Link>
    </div>
  );
}

export default QuizResult;
