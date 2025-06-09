import { useEffect, useState } from 'react';
import User from './User';

function Users() {
  const [users, setUsers] = useState([]);
  
  useEffect(function() {
    const getUsers = async function() {
      try {
        const res = await fetch('http://localhost:3001/users', {
          headers: {
            'Cache-Control': 'no-cache',
          },
          
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    getUsers();
  }, []);

  return (
    <>
      <h3>Users:</h3>
      <ul>
        {users.map(user => <User user={user} key={user._id} />)}
      </ul>
    </>
  );
}

export default Users;