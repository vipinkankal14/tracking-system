import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear customer data from localStorage
    localStorage.removeItem('customer');
    // Redirect to login page after logout
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default CustomerLogout;