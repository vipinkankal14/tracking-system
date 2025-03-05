import React, { useState, useEffect } from 'react';
import '../scss/CarAllotment.scss';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

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
  const [showAlertModal, setShowAlertModal] = useState(false);

  const navigate = useNavigate();

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
        .get(`http://localhost:5000/api/api/customer/${formData.customerId}`)
        .then((response) => {
          setCustomerData(response.data);
          setError('');

          // Validate car and customer details after fetching customer data
          if (carData) {
            validateDetails(response.data, carData);
          }
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Fetch car data
  useEffect(() => {
    if (vin) {
      axios
        .get(`http://localhost:5000/api/car/${vin}`)
        .then((response) => {
          setCarData(response.data);
          setError('');

          // Validate car and customer details after fetching car data
          if (customerData) {
            validateDetails(customerData, response.data);
          }
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

  // Validate car and customer details
  const validateDetails = (customerData, carData) => {
    if (
      carData.model !== customerData.model ||
      carData.version !== customerData.version ||
      carData.color !== customerData.color
    ) {
      setShowAlertModal(true); // Show alert modal if details do not match
      setFormData((prevState) => ({ ...prevState, customerId: '' })); // Clear customer ID input
      setCustomerData(null); // Reset customer data
    }
  };

  // Function to handle allotment
  const handleAllotment = async (status) => {
    if (carData && formData.customerId) {
      try {
        const response = await axios.put(`http://localhost:5000/api/car/update/${vin}`, {
          customerId: formData.customerId,
          allotmentCarStatus: status,
        });

        setCarData((prevState) => ({
          ...prevState,
          customerId: formData.customerId,
          allotmentCarStatus: status,
        }));
        setError('');
      } catch (error) {
        setError(error.response?.data?.message || 'Error updating allotment status');
      }
    }
  };

  // Show modal and set the action
  const handleShowModal = (action) => {
    setModalAction(action);
    setModalMessage(
      action === 'Allocated'
        ? 'Are you sure you want to allot this car to the customer?'
        : 'Are you sure you do not want to allot this car to the customer?'
    );
    setShowModal(true);
  };

  // Reset local data
  const resetLocalData = () => {
    setCustomerData(null); // Clear customer data
    setCarData(null); // Clear car data
    setFormData({ customerId: '' }); // Reset the form
    setError(''); // Clear any errors
  };

  // Handle modal confirmation
  const handleConfirm = async () => {
    try {
      await handleAllotment(modalAction); // Call handleAllotment with the modal action
      setShowModal(false); // Close the modal
      resetLocalData(); // Clear local data
      navigate('/car-stock-show'); // Redirect to the desired page
    } catch (error) {
      setError('Error confirming allotment');
    }
  };

  // Handle modal close
  const handleClose = () => setShowModal(false);
  const handleAlertClose = () => setShowAlertModal(false);

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

              {customerData.prebooking === "YES" && (
                <>
                  <Typography>
                    <strong>Pre Booking:</strong> {customerData.prebooking}
                  </Typography>
                  <Typography>
                    <strong>Prebooking date:</strong>{" "}
                    {formatDate(customerData.prebooking_date)}
                  </Typography>
                  <Typography>
                    <strong>Delivery date:</strong>{" "}
                    {formatDate(customerData.delivery_date)}
                  </Typography>
                </>
              )}

              {customerData.order_date === "YES" && (
                <>
                  <Typography>
                    <strong>Order Dates:</strong> {customerData.order_date}
                  </Typography>
                  <Typography>
                    <strong>Tentative Date:</strong>{" "}
                    {formatDate(customerData.tentative_date)}
                  </Typography>
                  <Typography>
                    <strong>Preferred Date:</strong>{" "}
                    {formatDate(customerData.preferred_date)}
                  </Typography>
                  <Typography>
                    <strong>Request Date:</strong>{" "}
                    {formatDate(customerData.request_date)}
                  </Typography>
                </>
              )}
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
              <p><strong>Manufacturer Date:</strong> {formatDate(carData.manufacturerDate)}</p>
              <p><strong>Date In:</strong> {formatDate(carData.dateIn)}</p>
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
            onClick={() => handleShowModal('Allocated')}
          >
            Allotment
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/car-stock-show')} // Navigate back
          >
            Back
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
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
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alert Modal */}
      <Modal show={showAlertModal} onHide={handleAlertClose} centered backdrop="static" keyboard={false} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Details Mismatch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The car details do not match the customer's details. Please check and try again.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAlertClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CarAllotment;