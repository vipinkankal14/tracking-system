import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/CarBookings.scss';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Modal } from 'react-bootstrap';
import TextareaAutosize from '@mui/material/TextareaAutosize';
 

export const OrderEditAndCancel = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const navigate = useNavigate();

  const fetchCustomerData = async () => {
    if (!customerId) {
      setError('Customer ID is undefined.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/customer/${customerId}`);
      if (!response.ok) {
        throw new Error(`Error fetching customer data: ${response.status}`);
      }
      const data = await response.json();

      if (data.length > 0) {
        setCustomerData(data[0]);
      } else {
        setError('No payments found for this customer.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching customer data: {error}</div>;

  const {
    firstName = 'N/A',
    middleName = '',
    lastName = 'N/A',
    customerType = 'N/A',
    birthDate = 'N/A',
    email = 'N/A',
    mobileNumber1 = 'N/A',
    mobileNumber2 = '',
    address = 'N/A',
    city = 'N/A',
    state = 'N/A',
    country = 'N/A',
    model = 'N/A',
    variant = 'N/A',
    color = 'N/A',
    team_Member = 'N/A',
    team_Leader = 'N/A',
    booking_amount = 'N/A',
    total_onroad_price = 'N/A',
    orderDate = 'N/A',
    prebooking = 'N/A',
    exchange = 'N/A',
    finance = 'N/A',
    accessories = 'N/A',
    coating = 'N/A',
    auto_card = 'N/A',
    extended_warranty = 'N/A',
    rto_tax = 'N/A',
    fast_tag = 'N/A',
    insurance = 'N/A',
    status = 'N/A',
  } = customerData || {};

  // Cancel Order Handler
 

  const handleCancelOrder = async () => {
    if (!isConfirmed) {
      alert('Please confirm the cancellation before proceeding.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cancel-order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          cancellationReason,
          isConfirmed: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel the order.');
      }

      const data = await response.json();
      alert(data.message);
      navigate('/car-Booking');
      closeModal();
    } catch (error) {
      console.error('Error:', error.message);
     }
  };


  const handleBack = () => window.history.back();

  return (
    <div className="payment-history">
      <div className="header">
        <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}>
          Booking for
          <IconButton style={{ marginLeft: '4px', padding: 0 }}>
            <AccountCircleRoundedIcon style={{ height: '20px' }} />
          </IconButton>
          <span style={{ color: '#092e6b', marginLeft: '1px', fontSize: '16px' }}>
            {`${customerData.firstName || ''} ${customerData.lastName || ''}`}
          </span>
        </Typography>
      </div>

      <div className="details-container">
        <Paper className="details customer-details" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
          <Typography variant="h6" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px', color: '#030547' }}>
            <strong>Customer Details</strong>
            <IconButton aria-label="edit" style={{ color: '#1976d2' }}>
              <EditIcon />
            </IconButton>
          </Typography>
          <Typography>
            <strong>Customer ID:</strong> {customerId || 'N/A'}{' '}
            {customerId && <VerifiedRoundedIcon style={{ color: '#092e6b', fontSize: '15px', marginTop: '-3px', marginRight: '-4px' }} />}
          </Typography>
          <Typography>
            <strong>Customer Type:</strong> {customerType || 'N/A'}
          </Typography>
          <Typography>
            <strong>Full Name:</strong> {`${firstName || 'N/A'} ${middleName || ''} ${lastName || ''}`}
          </Typography>
          <Typography>
            <strong>Birth Date:</strong> {birthDate || 'N/A'}
          </Typography>
          <Typography>
            <strong>Email:</strong> {email || 'N/A'}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {mobileNumber1 || 'N/A'}, {mobileNumber2 || 'N/A'}
          </Typography>
          <Typography>
            <strong>Address:</strong> {`${address || 'N/A'}, ${city || 'N/A'}`}
          </Typography>
          <Typography>
            <strong>State:</strong> {`${state || 'N/A'}, ${country || 'N/A'}`}
          </Typography>
          <Typography>Order Status: {status}</Typography>
        </Paper>

        {/* Car Details */}
        <Paper className="details car-details" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
          <Typography variant="h6" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px', color: '#030547' }}>
            <strong>Car Details</strong>
            <IconButton aria-label="edit" style={{ color: '#1976d2' }}>
              <EditIcon />
            </IconButton>
          </Typography>
          <Typography>
            <strong>Car Model:</strong> {model || 'N/A'}
          </Typography>
          <Typography>
            <strong>Car Variant:</strong> {variant || 'N/A'}
          </Typography>
          <Typography>
            <strong>Car Color:</strong> {color || 'N/A'}
          </Typography>
          <Typography>
            <strong>Team Member:</strong> {team_Member || 'N/A'}
          </Typography>
          <Typography>
            <strong>Team Leader:</strong> {team_Leader || 'N/A'}
          </Typography>
          <Typography>
            <strong>Booking Amount :</strong> {booking_amount || 'N/A'}
          </Typography>
          <Typography>
            <strong>On-Road Price :</strong> {total_onroad_price || 'N/A'}
          </Typography>
          <Typography>
            <strong>Order Date :</strong> {orderDate || 'N/A'}
          </Typography>
          <Typography>
            <strong>Pre Booking :</strong> {prebooking || 'N/A'}
          </Typography>
        </Paper>

        {/* Additional Details */}
        <Paper className="details car-details" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
          <Typography variant="h6" style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px', color: '#030547' }}>
            <strong>Additional Details</strong>
            <IconButton aria-label="edit" style={{ color: '#1976d2' }}>
              <EditIcon />
            </IconButton>
          </Typography>
          <Typography>
            <strong>Exchange:</strong> {exchange || 'N/A'}
          </Typography>
          <Typography>
            <strong>Finance:</strong> {finance || 'N/A'}
          </Typography>
          <Typography>
            <strong>Accessories:</strong> {accessories || 'N/A'}
          </Typography>
          <Typography>
            <strong>Coating:</strong> {coating || 'N/A'}
          </Typography>
          <Typography>
            <strong>Auto Card:</strong> {auto_card || 'N/A'}
          </Typography>
          <Typography>
            <strong>Extended Warranty:</strong> {extended_warranty || 'N/A'}
          </Typography>
          <Typography>
            <strong>RTO Tax:</strong> {rto_tax || 'N/A'}
          </Typography>
          <Typography>
            <strong>Fast Tag:</strong> {fast_tag || 'N/A'}
          </Typography>
          <Typography>
            <strong>Insurance:</strong> {insurance || 'N/A'}
          </Typography>
        </Paper>
      </div>

      <div className="button-container">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={openModal} className="action-btn" size="small">
            Cancel Order
          </Button>
          <Button variant="contained" onClick={handleBack} className="action-btn" size="small">
            Back
          </Button>
        </Stack>
      </div>

      {/* Modal for Cancel Order */}
      <Modal show={isModalOpen} onHide={closeModal} centered backdrop="static" keyboard={false} animation={false} >
        <Modal.Header closeButton>
        <Typography>
            <strong>Cancel Order for:</strong> {customerId || 'N/A'}{' '}
            {customerId && <VerifiedRoundedIcon style={{ color: '#092e6b', fontSize: '15px', marginTop: '-3px', marginRight: '-4px' }} />}
          </Typography>
         </Modal.Header>
         <Modal.Body>
          <Typography>Are you sure you want to cancel the order?</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Reason for cancellation (optional)"
            style={{ width: '100%', marginTop: '10px' }}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
          <div style={{ marginTop: '10px' }}>
          <input
            type="checkbox"
            id="confirmCheckbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            <label htmlFor="confirmCheckbox" style={{ marginLeft: '5px' }}>I confirm the cancellation</label>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button style={{ color: 'red', border: '1px solid red', marginLeft: '10px' }} onClick={handleCancelOrder} size="small">Cancel Order</Button>
          <Button onClick={closeModal} style={{ color: 'blue', border: '1px solid blue', marginLeft: '10px' }}  size="small"> Back</Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};
