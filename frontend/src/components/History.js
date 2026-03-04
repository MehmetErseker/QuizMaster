import { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

function History() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/quiz/history')
      .then(({ data }) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error(error);
        setRows([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading quiz history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <h1>Quiz History</h1>
          <p>Track your quiz performance over time</p>
        </div>

        {rows.length === 0 ? (
          <div className="empty-state">
            <h3>No quiz history yet</h3>
            <p>Start taking quizzes to see your results here!</p>
          </div>
        ) : (
          <div className="history-grid">
            {rows.map((record, index) => (
              <div key={record._id} className="history-card">
                <div className="card-header">
                  <div className="rank-badge">#{index + 1}</div>
                  <div className="score-display">
                    <span className="score-value">{record.totalScore.toFixed(1)}</span>
                    <span className="score-label">points</span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">User</span>
                      <span className="info-value">{record.userId?.username || 'Anonymous'}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Date</span>
                      <span className="info-value">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Time</span>
                      <span className="info-value">
                        {new Date(record.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
