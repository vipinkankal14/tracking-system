import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerLogin = () => {
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/customer/login', { customerId });
      if (response.data.success) {
        // Save customer data to localStorage or context
        localStorage.setItem('customer', JSON.stringify(response.data.customer));
        navigate('/dashboard'); // Redirect to dashboard or home page
      } else {
        setError('Invalid customer ID');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="customerId">Customer ID:</label>
          <input
            type="text"
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default CustomerLogin;