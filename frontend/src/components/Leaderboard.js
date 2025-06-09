import { useEffect, useState } from 'react';
import './Leaderboard.css';

function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/quiz/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const getRankIcon = (position) => {
    switch (position) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankClass = (position) => {
    switch (position) {
      case 1: return 'rank-gold';
      case 2: return 'rank-silver';
      case 3: return 'rank-bronze';
      default: return 'rank-default';
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>🏆 Leaderboard</h1>
          <p>Top 10 quiz performers of all time</p>
        </div>

        {rows.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>No scores yet</h3>
            <p>Be the first to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {rows.map((record, index) => {
              const position = index + 1;
              return (
                <div 
                  key={record._id} 
                  className={`leaderboard-item ${getRankClass(position)}`}
                >
                  <div className="rank-section">
                    <div className="rank-number">#{position}</div>
                    <div className="rank-icon">{getRankIcon(position)}</div>
                  </div>
                  
                  <div className="player-info">
                    <div className="player-name">
                      {record.userId?.username || 'Anonymous'}
                    </div>
                    <div className="player-date">
                      {new Date(record.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="score-section">
                    <div className="score-value">
                      {record.totalScore.toFixed(1)}
                    </div>
                    <div className="score-label">points</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;