import React, { useState, useEffect } from 'react';
import './scss/CarAllotment.scss';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
 

const CarAllotment = () => {
  const { vin } = useParams(); // Get VIN from the URL
  const [customerData, setCustomerData] = useState(null);
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ customerId: '' });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch customer data
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

  // Fetch car data
  useEffect(() => {
    if (vin) {
      axios
        .get(`http://localhost:5000/api/car/${vin}`)
        .then((response) => {
          setCarData(response.data);
          setError('');
        })
        .catch((error) => {
          setCarData(null);
          if (error.response && error.response.status === 404) {
            setError('Car not found');
          } else {
            setError('Error fetching car data');
          }
        });
    }
  }, [vin]);

  // Function to handle allotment
  const handleAllotment = (status) => {
    if (carData && formData.customerId) {
      axios
        .put(`http://localhost:5000/api/car/update/${vin}`, {
          customerId: formData.customerId,
          allotmentCarStatus: status,
        })
        .then((response) => {
          setCarData((prevState) => ({
            ...prevState,
            customerId: formData.customerId,
            allotmentCarStatus: status,
          }));
          setError('');
        })
        .catch((error) => {
          setError('Error updating allotment status');
        });
    }
  };

  // Show modal and set the action
  const handleShowModal = (action) => {
    setModalAction(action);
    setModalMessage(
      action === 'Allotment'
        ? 'Are you sure you want to allot this car to the customer?'
        : 'Are you sure you do not want to allot this car to the customer?'
    );
    setShowModal(true);
  };

  // Handle modal confirmation
  const handleConfirm = () => {
    handleAllotment(modalAction);
    setShowModal(false);
  };

  // Handle modal close
  const handleClose = () => setShowModal(false);


  return (
    <>
      <p className="car-allotment-title">CAR ALLOTMENT</p>
     
 
 
      <div className="car-allotment form-output">
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

        <br />

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

        {carData && (
          <>
            <h6>Car Info</h6>
            <div className="form-data">
              <p><strong>VIN:</strong> {carData.vin}</p>
              <p><strong>Chassis Number:</strong> {carData.chassisNumber}</p>
              <p><strong>Engine Number:</strong> {carData.engineNumber}</p>
              <p><strong>Fuel Type:</strong> {carData.fuelType}</p>
              <p><strong>Manufacturer Date:</strong> {carData.manufacturerDate}</p>
              <p><strong>Date In:</strong> {carData.dateIn}</p>
              <p><strong>Version:</strong> {carData.version}</p>
              <p><strong>Model:</strong> {carData.model}</p>
              <p><strong>Color:</strong> {carData.color}</p>
            </div>
          </>
        )}

        <div className="d-flex gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={() => handleShowModal('Allotment')}
          >
            Allotment
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleShowModal('NotAllotment')}
          >
            Not Allotment
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered backdrop="static" keyboard={false} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {customerData && (
      <>
        <p>
          <strong>Customer ID:</strong> {formData.customerId}
        </p>
        <p>
          <strong>Full Name:</strong> {`${customerData.firstName} ${customerData.middleName} ${customerData.lastName}`}
        </p>
      </>
          )}
          {modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CarAllotment;
