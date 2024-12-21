import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CarDetails = () => {
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData); // Replace with API call
    navigate('/order-details');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="row g-3">
        <h6>CAR DETAILS</h6>

       

        {/* Model */}
        <div className="col-md-4">
          <select
            className="form-control"
            name="model"
            onChange={handleChange}
            required
          >
            <option value="">Select Model</option>
            <option value="Model A">Model A</option>
            <option value="Model B">Model B</option>
            <option value="Model C">Model C</option>
          </select>
        </div>

        {/* Variant */}
        <div className="col-md-4">
          <select
            className="form-control"
            name="variant"
            onChange={handleChange}
            required
          >
            <option value="">Select Variant</option>
            <option value="Variant 1">Variant 1</option>
            <option value="Variant 2">Variant 2</option>
          </select>
        </div>

        {/* Color */}
        <div className="col-md-4">
          <select
            className="form-control"
            name="color"
            onChange={handleChange}
            required
          >
            <option value="">Select Color</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Black">Black</option>
          </select>
        </div>

         {/* RM Name */}
         <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Relationship Manager Name"
            name="rmName"
            onChange={handleChange}
            required
          />
        </div>

        {/* SRM Name */}
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Senior Relationship Manager Name"
            name="srmName"
            onChange={handleChange}
            required
          />
        </div>

        {/* Ex-Showroom Price */}
        <div className="col-md-6">
          <input
            type="number"
            className="form-control"
            placeholder="Ex-Showroom Price"
            name="exShowroomPrice"
            onChange={handleChange}
            required
          />
        </div>

        {/* Booking Amount */}
        <div className="col-md-6">
          <input
            type="number"
            className="form-control"
            placeholder="Booking Amount"
            name="bookingAmount"
            onChange={handleChange}
            required
          />
        </div>

       

      </div>

      <div className="d-flex justify-content-between mt-4">
        {/* Back Button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Back
        </button>

        {/* Next Button */}
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </div>
    </form>
  );
};

export default CarDetails;
