import { useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { Navigate } from 'react-router-dom';

function Logout() {
  const { handleLogout } = useContext(UserContext);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <Navigate to="/login" replace />;
}

export default Logout;