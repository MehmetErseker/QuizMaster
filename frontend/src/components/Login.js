// src/components/Login.js
import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { UserContext } from '../App';
import './Login.css';

function Login() {
  const { user, setUserContext } = useContext(UserContext);

  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { data } = await axios.post('/users/login', { username, password });
      if (data && data._id) {
        setUserContext(data);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setUsername('');
      setPassword('');
      setError(err.response?.data?.msg || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleGoogleSuccess = async ({ credential }) => {
    setError('');
    setIsLoading(true);
    
    try {
      
      await axios.post('/users/auth/google', { credential });

      
      const { data } = await axios.get('/users/me');
      setUserContext(data);
    } catch (err) {
      console.error(err);
      setError('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  
  if (user) return <Navigate replace to="/" />;

  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please sign in to your account</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Local form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          {/* Google button */}
          <div className="google-login-container">
            <GoogleLogin
              type="standard"
              shape="rectangular"
              theme="filled_blue"
              size="large"
              text="signin_with"
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login aborted')}
              disabled={isLoading}
            />
          </div>

          <div className="login-footer">
            <p>Don't have an account? <a href="/register">Sign up here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;