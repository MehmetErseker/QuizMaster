// src/components/Profile.js
import { useContext } from 'react';
import { UserContext } from '../App';
import { Navigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const userContext = useContext(UserContext);

  if (!userContext.user) {
    return <Navigate replace to="/login" />;
  }

  const { user } = userContext;
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Not available';

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="User Avatar" 
                  className="avatar-image"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials(user.username)}
                </div>
              )}
            </div>
            <div className="profile-title">
              <h1>User Profile</h1>
              <p>Welcome back, {user.username}!</p>
            </div>
          </div>

          <div className="profile-content">
            <div className="info-section">
              <h2>Account Information</h2>
              
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <span className="info-icon">👤</span>
                    Username
                  </div>
                  <div className="info-value">{user.username}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <span className="info-icon">✉️</span>
                    Email Address
                  </div>
                  <div className="info-value">{user.email}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <span className="info-icon">📅</span>
                    Member Since
                  </div>
                  <div className="info-value">{joinDate}</div>
                </div>

                {user.provider && (
                  <div className="info-item">
                    <div className="info-label">
                      <span className="info-icon">🔐</span>
                      Login Method
                    </div>
                    <div className="info-value">
                      <span className="provider-badge">
                        {user.provider === 'google' ? 'Google Account' : 'Email & Password'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;