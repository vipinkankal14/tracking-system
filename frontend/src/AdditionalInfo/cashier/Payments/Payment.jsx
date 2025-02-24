import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

import "../css/Payment.scss";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [customerId, setCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCustomerIdChange = (e) => {
    setCustomerId(e.target.value.trim());
    setError("");
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customerId) {
        setCustomerDetails(null);
        setError("Customer ID cannot be empty.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await fetch(`http://localhost:5000/api/customers/${customerId}`);
        if (!response.ok) {
          throw new Error("Customer not found");
        }
        const data = await response.json();
        setCustomerDetails(data);
        setError("");
      } catch (err) {
        setCustomerDetails(null);
        setError("No record found for the given Customer ID.");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const handlePayment = () => {
    if (customerDetails) {
      navigate("/payment-details", {
        state: {
          customerId,
          customerName: `${customerDetails.firstName} ${customerDetails.middleName} ${customerDetails.lastName}`,
          customer: `${customerDetails.total_onroad_price}`,
          accountBalance: customerDetails.customer_account_balance,
        },
        replace: true,
      });
    } else {
      alert("Please enter a valid Customer ID.");
    }
  };

  return (
    <div className="customer-details-container">
      <div className="search-section">
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-sx"
            label="Customer ID"
            variant="standard"
            onChange={handleCustomerIdChange}
          />
        </Box>
        {loading && <p className="loading-message">Loading...</p>}
      </div>

      <div style={{color:'#d4000e'}}>{error && <p className="error-message">{error}</p>}</div>    

      
      <div className="details-section">
        <div className="info-box">
          <h4>Customer Info</h4>
          <p>
            Customer ID: {customerDetails?.customerId}
            {customerDetails?.customerId && (
              <VerifiedRoundedIcon style={{ color: '#092e6b', fontSize: '15px', marginLeft: '5px' }} />
            )}
          </p>
          <p>Name: {customerDetails?.firstName} {customerDetails?.middleName} {customerDetails?.lastName}</p>
          <p>Number: {customerDetails?.mobileNumber1} {customerDetails?.mobileNumber2}</p>
          <p>Email: {customerDetails?.email}</p>
        </div>

        <div className="info-box">
          <h4>Payment Details</h4>
          <p>Total On-Road Price: {customerDetails?.total_onroad_price}</p>
          <p>Amount Paid by Customer: {customerDetails?.customer_account_balance}</p>
        </div>

        <div className="info-box">
          <h4>Car Details</h4>
          <p>Car Model: {customerDetails?.model}</p>
          <p>Car Color: {customerDetails?.color}</p>
          <p>Car Variant: {customerDetails?.variant}</p>
        </div>

        <div className="info-box">
          <h4>Dealership Advisor</h4>
          <p>Team Leader: {customerDetails?.team_Leader}</p>
          <p>Team Member: {customerDetails?.team_Member}</p>
        </div>
      </div>

      <div className="action-buttons">
        <Button
          variant="outlined"
          color="primary"
          className="proceed-btn"
          onClick={handlePayment}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default Payment;
