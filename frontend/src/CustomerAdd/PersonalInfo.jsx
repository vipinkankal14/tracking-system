import React, { useState } from 'react';

const PersonalInfo = ({ data, updateData }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    updateData(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: null }));
    }
    validateField(field, value);
  };

  const validateField = (field, value) => {
    if (!value) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: `${field.replace(/([A-Z])/g, ' $1')} is required` }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: null }));
    }
  };

  return (
    <form className="row g-4" style={{ padding: "10px" }}>
      <div className="col-md-3">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          className={`form-control input-underline input-margin ${errors.firstName ? 'is-invalid' : ''}`}
          id="firstName"
          value={data.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          required
        />
        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
      </div>

      <div className="col-md-3">
        <label htmlFor="middleName">Middle Name</label>
        <input
          type="text"
          className="form-control input-underline input-margin"
          id="middleName"
          value={data.middleName}
          onChange={(e) => handleChange('middleName', e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          className={`form-control input-underline input-margin ${errors.lastName ? 'is-invalid' : ''}`}
          id="lastName"
          value={data.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          required
        />
        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
      </div>

      <div className="col-md-3">
        <label htmlFor="customerType">Customer Type</label>
        <select
          className="form-control input-underline input-margin"
          id="customerType"
          value={data.customerType}
          onChange={(e) => handleChange('customerType', e.target.value)}
        >
          <option value="">Select Customer Type</option>
          <option value="individual">Individual</option>
          <option value="corporate">Corporate</option>
          <option value="government">Government</option>
          <option value="business">Business</option>
          <option value="non-profit">Non-Profit</option>
          <option value="farmer">Farmer</option>
        </select>
      </div>

      <div className="col-md-2">
        <label htmlFor="birthDate">Birth Date</label>
        <input
          type="date"
          className={`form-control input-underline input-margin ${errors.birthDate ? 'is-invalid' : ''}`}
          id="birthDate"
          value={data.birthDate}
          onChange={(e) => handleChange('birthDate', e.target.value)}
          required
        />
        {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
      </div>

      <div className="col-md-3">
        <label htmlFor="mobileNumber1">Mobile Number</label>
        <input
          type="tel"
          className="form-control input-underline input-margin"
          id="mobileNumber1"
          value={data.mobileNumber1}
          onChange={(e) => handleChange('mobileNumber1', e.target.value.replace(/\D/g, ''))}
          placeholder="Enter first mobile number"
        />
      </div>

      <div className="col-md-3">
        <label htmlFor="mobileNumber2">Mobile Number</label>
        <input
          type="tel"
          className="form-control input-underline input-margin"
          id="mobileNumber2"
          value={data.mobileNumber2}
          onChange={(e) => handleChange('mobileNumber2', e.target.value.replace(/\D/g, ''))}
          placeholder="Enter secondary mobile number"
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          className={`form-control input-underline input-margin ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="col-md-2">
        <label htmlFor="aadhaarNumber">Aadhaar Number</label>
        <input
          type="text"
          className={`form-control input-underline input-margin ${errors.aadhaarNumber ? 'is-invalid' : ''}`}
          id="aadhaarNumber"
          value={data.aadhaarNumber}
          onChange={(e) => handleChange('aadhaarNumber', e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join('/').slice(0, 14) || '')}
          placeholder="1234/5678/9123"
          maxLength="14"
          required
        />
        {errors.aadhaarNumber && <div className="invalid-feedback">{errors.aadhaarNumber}</div>}
      </div>

      <div className="col-md-2">
        <label htmlFor="panNumber">Pan Card</label>
        <input
          type="text"
          className={`form-control input-underline input-margin ${errors.panNumber ? 'is-invalid' : ''}`}
          id="panNumber"
          value={data.panNumber}
          onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
          required
          maxLength="16"
        />
        {errors.panNumber && <div className="invalid-feedback">{errors.panNumber}</div>}
      </div>

      <div className="col-md-3">
        <label htmlFor="city">City</label>
        <input
          type="text"
          className={`form-control input-underline input-margin ${errors.city ? 'is-invalid' : ''}`}
          id="city"
          value={data.city}
          onChange={(e) => handleChange('city', e.target.value)}
          required
        />
        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
      </div>

      <div className="col-md-3">
        <label htmlFor="state">State</label>
        <input
          type="text"
          className={`form-control input-underline input-margin ${errors.state ? 'is-invalid' : ''}`}
          id="state"
          value={data.state}
          onChange={(e) => handleChange('state', e.target.value)}
          required
        />
        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
      </div>

      <div className="col-md-2">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          className={`form-control input-underline input-margin ${errors.country ? 'is-invalid' : ''}`}
          id="country"
          value={data.country}
          onChange={(e) => handleChange('country', e.target.value)}
          required
        />
        {errors.country && <div className="invalid-feedback">{errors.country}</div>}
      </div>

      <div className="col-md-12">
        <label htmlFor="address">Address/Apartment/Unit/Suite</label>
        <input
          type="text"
          className={`form-control input-underline input-margin ${errors.address ? 'is-invalid' : ''}`}
          id="address"
          value={data.address}
          onChange={(e) => handleChange('address', e.target.value)}
          required
        />
        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
      </div>
    </form>
  );
};

export default PersonalInfo;
