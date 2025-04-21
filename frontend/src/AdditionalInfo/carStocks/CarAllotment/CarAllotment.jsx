import React, { useState, useEffect } from 'react';
import {  Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  TextField, 
  Divider, 
  Card, 
  CardContent, 
  CardHeader, 
  CardActions,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

// Import your SCSS file
import '../scss/CarAllotment.scss';

const CarAllotment = () => {
  const { vin } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Get targetCustomerId from navigation state
  const targetCustomerId = location.state?.targetCustomerId || '';

  // Initialize form data with targetCustomerId
  const [formData, setFormData] = useState({ 
    customerId: targetCustomerId
  });

  const [customerData, setCustomerData] = useState(null);
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Automatically trigger customer search if targetCustomerId exists
  useEffect(() => {
    if (targetCustomerId) {
      setFormData({ customerId: targetCustomerId });
    }
  }, [targetCustomerId]);

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

          if (carData) {
            validateDetails(response.data, carData);
          }
        })
        .catch((error) => {
          setCustomerData(null);
          if (error.response?.status === 404) {
            setError('Customer not found');
          } else {
            setError('Error fetching customer data');
          }
        });
    }
  }, [formData.customerId, carData]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return dateString ? new Date(dateString).toLocaleDateString("en-US", options) : "N/A";
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
  }, [vin, customerData]);

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
      navigate('/car-stock-Management/car-management'); // Redirect to the desired page
    } catch (error) {
      setError('Error confirming allotment');
    }
  };

  // Handle modal close
  const handleClose = () => setShowModal(false);
  const handleAlertClose = () => setShowAlertModal(false);

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  // Render customer information section
  const renderCustomerInfo = () => {
    if (!customerData) return null;

    return (
      <Box sx={{ mb: 3 }} >
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>First Name:</strong> {customerData.firstName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Last Name:</strong> {customerData.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Mobile Number:</strong> {customerData.mobileNumber1}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Email:</strong> {customerData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Aadhaar Number:</strong> {customerData.aadhaarNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Pan Number:</strong> {customerData.panNumber}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Car Model:</strong> {customerData.model}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Car Variant:</strong> {customerData.version}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Car Color:</strong> {customerData.color}
              </Typography>
            </Grid>

            {customerData.prebooking === "YES" && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Pre-booking Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Pre Booking:</strong> {customerData.prebooking}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Prebooking date:</strong> {formatDate(customerData.prebooking_date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Delivery date:</strong> {formatDate(customerData.delivery_date)}
                  </Typography>
                </Grid>
              </>
            )}

            {customerData.order_date === "YES" && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Order Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2">
                    <strong>Order Dates:</strong> {customerData.order_date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2">
                    <strong>Tentative Date:</strong> {formatDate(customerData.tentative_date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2">
                    <strong>Preferred Date:</strong> {formatDate(customerData.preferred_date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2">
                    <strong>Request Date:</strong> {formatDate(customerData.request_date)}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Box>
    );
  };

  // Render car information section
  const renderCarInfo = () => {
    if (!carData) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Car Allotment Information
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>VIN:</strong> {carData.vin}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Chassis Number:</strong> {carData.chassisNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Engine Number:</strong> {carData.engineNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Fuel Type:</strong> {carData.fuelType}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Manufacturer Date:</strong> {formatDate(carData.manufacturerDate)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Date In:</strong> {formatDate(carData.dateIn)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Version:</strong> {carData.version}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Model:</strong> {carData.model}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2">
                <strong>Color:</strong> {carData.color}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  const renderMobileView = () => (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Customer ID" 
          titleTypographyProps={{ variant: 'subtitle1' }}
        />
        <CardContent sx={{ pt: 0 }}>
          <TextField
            fullWidth
            size="small"
             name="customerId"
            value={formData.customerId}
            onChange={handleInputChange}
            disabled={!!targetCustomerId}
            error={!!error}
            helperText={error}
            variant="outlined"
            margin="dense"
          />
        </CardContent>
      </Card>

      {customerData && (
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Customer Details" 
            titleTypographyProps={{ variant: 'subtitle1' }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {customerData.firstName} {customerData.lastName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Mobile:</strong> {customerData.mobileNumber1}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {customerData.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Model:</strong> {customerData.model}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Color:</strong> {customerData.color}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  <strong>Variant:</strong> {customerData.version}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {carData && (
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Car Details" 
            titleTypographyProps={{ variant: 'subtitle1' }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  <strong>VIN:</strong> {carData.vin}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Model:</strong> {carData.model}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Version:</strong> {carData.version}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Color:</strong> {carData.color}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Fuel:</strong> {carData.fuelType}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  <strong>Chassis:</strong> {carData.chassisNumber}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
  
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleShowModal('Allocated')}
            >
              Allotment
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  )

  // Render tablet/desktop view
  const renderDesktopView = () => (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item   >
            <Typography variant="subtitle1">
              <strong>CUSTOMER ID:</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              size="small"
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              disabled={!!targetCustomerId}
              error={!!error}
              helperText={error}
              variant="outlined"
               
            />
          </Grid>
        </Grid>
      </Paper>

      {renderCustomerInfo()}
      {renderCarInfo()}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          color='success'
          size="sm"
          onClick={() => handleShowModal('Allocated')}
        >
          Allotment
        </Button>
 
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }} style={{marginTop:'-60px'}} >
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackClick}
        sx={{ mb: 2 }}
        variant="text"
      >
        Back
      </Button>
      
      
      <Typography variant="h6" sx={{ mb: 3, color: "#071947" }}>
        CAR ALLOTMENT
      </Typography>

      {/* Responsive Content */}
      {isMobile ? renderMobileView() : renderDesktopView()}

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
                <strong>Full Name:</strong> {`${customerData.firstName} ${customerData.middleName || ''} ${customerData.lastName}`}
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
    </Box>
  );
};

export default CarAllotment;