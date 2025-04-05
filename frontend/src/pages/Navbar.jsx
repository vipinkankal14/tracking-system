import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to get user info (note: don't use this for sensitive data)
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser(userData);
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout API
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Clear local storage and redirect
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Your App Name</div>
      
      {user && (
        <div className="user-profile">
          <div className="user-info">
            {user.profile_image && (
              <img 
                src={user.profile_image} 
                alt="Profile" 
                className="profile-image"
              />
            )}
            <div className="user-details">
              <span className="username">{user.username}</span>
              <span className="emp-id">{user.emp_id}</span>
              <span className="role">{user.role}</span>
            </div>
          </div>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;