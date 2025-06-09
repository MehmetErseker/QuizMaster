// src/components/Header.js
import { useContext } from 'react';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const { user, handleLogout } = useContext(UserContext);

  return (
    <div className="header-app">
      <nav className="header-navbar">
        <div className="header-logo">
          <Link to="/">QuizMaster</Link>
        </div>
        <ul className="header-links">
          <li><Link to="/">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/quiz-home">Start Quiz</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/history">History</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              {user.avatar && (
                <li className="header-avatar">
                  <img src={user.avatar} alt="User Avatar" referrerPolicy="no-referrer" />
                </li>
              )}
              <li>
                <button className="header-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </div>

  );
}

export default Header;