import { createContext, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Header       from './components/Header';
import Login        from './components/Login';
import Profile      from './components/Profile';
import Register     from './components/Register';
import Logout       from './components/Logout';
import QuizHome     from './components/QuizHome';
import QuizPlay     from './components/QuizPlay';
import QuizResult   from './components/QuizResult';
import Leaderboard  from './components/Leaderboard';
import History      from './components/History';
import MainPage     from './components/MainPage';


axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API || 'http://localhost:3001';


export const UserContext = createContext({
  user: null,
  setUserContext: () => {},
  handleLogout:    () => {},
});

function App() {
  const [user, setUser] = useState(
    localStorage.user ? JSON.parse(localStorage.user) : null
  );

  const updateUserData = (userInfo) => {
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    axios.post('/users/logout').catch(() => {});
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <UserContext.Provider
        value={{ user, setUserContext: updateUserData, handleLogout }}
      >
        <BrowserRouter>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/"             element={<MainPage />}                    />
              <Route path="/login"        element={<Login />} />
              <Route path="/register"     element={<Register />} />
              <Route path="/profile"      element={user ? <Profile />      : <Navigate to="/login" />} />
              <Route path="/logout"       element={<Logout />} />
              <Route path="/quiz-home"    element={user ? <QuizHome />     : <Navigate to="/login" />} />
              <Route path="/quiz"         element={user ? <QuizPlay />     : <Navigate to="/login" />} />
              <Route path="/quiz-result"  element={user ? <QuizResult />   : <Navigate to="/login" />} />
              <Route path="/leaderboard"  element={<Leaderboard />} />
              <Route path="/history"      element={user ? <History /> : <Navigate to="/login" />} />
              <Route path="/main-page"    element={<MainPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
