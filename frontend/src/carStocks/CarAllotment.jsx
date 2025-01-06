import React, { useState, useEffect } from 'react';
import './scss/CarAllotment.scss';
import { Badge, Stack } from 'react-bootstrap';
import axios from 'axios';

const CarAllotment = () => {
  const [formData, setFormData] = useState({
    vin: '1HGCM82633A123456',
    manufacturerDate: '2022-08-15',
    dateIn: '2023-01-05',
    model: 'Honda Accord',
    color: 'Silver',
    fuelType: 'Petrol',
    chassisNumber: '12345XYZ',
    engineNumber: '67890XYZ',
    version: 'EX',
    customerId: '', // Initialize with empty string
  });

  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.customerId) {
      axios
        .get(`http://localhost:5000/api/customer/${formData.customerId}`)
        .then((response) => {
          setCustomerData(response.data);
          setError('');
        })
        .catch((error) => {
          setCustomerData(null);
          if (error.response && error.response.status === 404) {
            setError('Customer not found');
          } else {
            setError('Error fetching customer data');
          }
        });
    }
  }, [formData.customerId]);

  return (
    <>
      <p className="car-allotment-title">CAR ALLOTMENT</p>
      <div className="car-allotment form-output">
        {/* Customer ID Section */}
        <div className="form-data">
          <p>
            <strong>CUSTOMER ID: </strong>
            <input
              type="text"
              className="input-underline"
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              placeholder="Enter Customer ID"
              style={{ width: '140px', paddingLeft: '8px' }}
            />
          </p>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Customer Info Section - Stack */}
        {customerData && (
          <>
            <h6>Customer</h6>
          <div className="form-data">
              <p><strong>First Name:</strong> {customerData.firstName}</p>
              <p><strong>Last Name:</strong> {customerData.lastName}</p>
              <p><strong>Mobile Number 1:</strong> {customerData.mobileNumber1}</p>
              <p><strong>Email:</strong> {customerData.email}</p>
              <p><strong>Aadhaar Number:</strong> {customerData.aadhaarNumber}</p>
              <p><strong>Pan Number:</strong> {customerData.panNumber}</p>
              <p><strong>Car Model:</strong> {customerData.model}</p>
              <p><strong>Car Variant:</strong> {customerData.variant}</p>
              <p><strong>Car Color:</strong> {customerData.color}</p>
              <p><strong>Order Date:</strong> {customerData.orderDate}</p>
              <p><strong>Delivery Date:</strong> {customerData.delivery_date}</p>
          </div>
          </>
          
        )}

        <br />
        <>
        <h6>Car info</h6>
        <div className="form-data">
          <p><strong>VIN:</strong> {formData.vin}</p>
          <p><strong>Chassis Number:</strong> {formData.chassisNumber}</p>
          <p><strong>Engine Number:</strong> {formData.engineNumber}</p>
          <p><strong>Fuel Type:</strong> {formData.fuelType}</p>
          <p><strong>Manufacturer Date:</strong> {formData.manufacturerDate}</p>
          <p><strong>Date In:</strong> {formData.dateIn}</p>
          <p><strong>Version:</strong> {formData.version}</p>
          <p><strong>Model:</strong> {formData.model}</p>
          <p><strong>Color:</strong> {formData.color}</p>
        </div>
        </>

        {/* Badge Section */}
        <div className="badge-section">
          <Stack direction="horizontal" gap={2}>
            <Badge bg="success">Allotment</Badge>
            <Badge bg="danger">Not Allotment</Badge>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default CarAllotment;
