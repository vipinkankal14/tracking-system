import React, { useState } from 'react';
import axios from 'axios';

const DiscountForCarAndAdditional = () => {
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [version, setVersion] = useState('');
  const [discount, setDiscount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset messages
    setMessage('');
    setError('');

    // Validate inputs
    if (!model || !color || !version || isNaN(discount)) {
      setError('All fields are required, and discount must be a number.');
      return;
    }

    // Prepare the data to send
    const data = {
      model,
      color,
      version,
      discount: parseInt(discount), // Ensure discount is a number
    };

    try {
      const response = await axios.post('http://localhost:5000/api/discountForCriteria', data);
      setMessage(response.data.message);
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.error : 'An error occurred while updating the discount.');
    }
  };

  return (
    <div>
      <h2>Update Car Discount</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Model:</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div>
          <label>Color:</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
        </div>
        <div>
          <label>Version:</label>
          <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} required />
        </div>
        <div>
          <label>Discount:</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} required />
        </div>
        <button type="submit">Update Discount</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DiscountForCarAndAdditional;
