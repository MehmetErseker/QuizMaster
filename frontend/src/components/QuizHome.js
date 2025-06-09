import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import './QuizHome.css';

function QuizHome() {
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const startQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/quiz/start', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Cannot start quiz');
      const questions = await res.json();
      sessionStorage.setItem('currentQuiz', JSON.stringify(questions));
      navigate('/quiz');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-home-page">
      <div className="quiz-home-container">
        <div className="quiz-home-card">
          <div className="welcome-header">
            <div className="welcome-icon">🎯</div>
            <h1 className="welcome-title">
              Welcome{user ? `, ${user.username}` : ''}!
            </h1>
            <p className="welcome-subtitle">
              Click below to start a 10-question quiz.
            </p>
          </div>
          
          <div className="quiz-actions">
            <button 
              className="start-quiz-btn" 
              onClick={startQuiz} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Preparing…
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Start Quiz
                </>
              )}
            </button>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizHome;