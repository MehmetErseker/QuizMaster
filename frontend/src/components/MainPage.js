import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';

function MainPage() {
  const [topThree, setTopThree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/quiz/leaderboard')
      .then(({ data }) => {
        setTopThree(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch((error) => {
        console.error(error);
        setTopThree([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getRankClass = (position) => {
    switch (position) {
      case 1:
        return 'rank-gold';
      case 2:
        return 'rank-silver';
      case 3:
        return 'rank-bronze';
      default:
        return 'rank-default';
    }
  };

  if (loading) {
    return (
      <div className="main-page">
        <div className="main-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page">
      <div className="main-container">
        <div className="welcome-section">
          <h1>Quiz Master</h1>
          <p>Test your knowledge and compete with others!</p>
          <div className="action-buttons">
            <Link to="/quiz-home" className="btn-primary">
              Start Quiz
            </Link>
            <Link to="/leaderboard" className="btn-secondary">
              View Full Leaderboard
            </Link>
          </div>
        </div>

        <div className="top-performers">
          <h2>Top Performers</h2>

          {topThree.length === 0 ? (
            <div className="empty-state">
              <h3>No scores yet</h3>
              <p>Be the first to appear on the leaderboard!</p>
            </div>
          ) : (
            <div className="top-three-grid">
              {topThree.map((record, index) => {
                const position = index + 1;
                return (
                  <div
                    key={record._id}
                    className={`top-player-card ${getRankClass(position)}`}
                  >
                    <div className="rank-badge">
                      <div className="rank-number">#{position}</div>
                    </div>

                    <div className="player-details">
                      <div className="player-name">
                        {record.userId?.username || 'Anonymous'}
                      </div>
                      <div className="player-score">
                        {record.totalScore.toFixed(1)} <span>points</span>
                      </div>
                      <div className="player-date">
                        {new Date(record.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
