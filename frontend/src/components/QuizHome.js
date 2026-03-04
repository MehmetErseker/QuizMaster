import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../App';
import './QuizHome.css';

function QuizHome() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const startQuiz = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.get('/quiz/start');
      sessionStorage.setItem('currentQuiz', JSON.stringify(data));
      navigate('/quiz');
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot start quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-home-page">
      <div className="quiz-home-container">
        <div className="quiz-home-card">
          <div className="welcome-header">
            <h1 className="welcome-title">Welcome{user ? `, ${user.username}` : ''}!</h1>
            <p className="welcome-subtitle">Click below to start a 10-question quiz.</p>
          </div>

          <div className="quiz-actions">
            <button className="start-quiz-btn" onClick={startQuiz} disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Preparing...
                </>
              ) : (
                'Start Quiz'
              )}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizHome;
