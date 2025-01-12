import React, { useState } from 'react';
import axios from 'axios';

const UpdateDiscountForm = () => {
  const [selectedCars, setSelectedCars] = useState([]);
  const [discount, setDiscount] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (selectedCars.length === 0 || !discount) {
      setResponseMessage('Please provide valid car VINs and discount.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/updateDiscount', {
        selectedCars,
        discount: parseInt(discount, 10),
      });

      setResponseMessage(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'An error occurred. Please try again.';
      setResponseMessage(errorMessage);
    }
  };

  // Handle input changes
  const handleVINChange = (e) => {
    const vins = e.target.value.split(',').map((vin) => vin.trim());
    setSelectedCars(vins);
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h3>Update Car Discounts</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="vins">Car VINs (comma-separated):</label>
          <input
            type="text"
            id="vins"
            placeholder="Enter VINs"
            onChange={handleVINChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="discount">Discount Amount:</label>
          <input
            type="number"
            id="discount"
            placeholder="Enter discount"
            onChange={handleDiscountChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#007BFF', color: '#FFF', border: 'none', cursor: 'pointer' }}>
          Update Discount
        </button>
      </form>
      {responseMessage && (
        <p style={{ marginTop: '20px', color: 'green' }}>{responseMessage}</p>
      )}
    </div>
  );
};

export default UpdateDiscountForm;
