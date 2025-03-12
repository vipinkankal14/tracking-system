import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

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
        const response = await fetch(
          `http://localhost:5000/api/customerspay/${customerId}`
        );
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
          customer: `${customerDetails.grand_total}`,
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
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-sx"
            label="Customer ID"
            variant="standard"
            onChange={handleCustomerIdChange}
          />
        </Box>
        {loading && (
          <Typography className="loading-message">Loading...</Typography>
        )}
      </div>

      <div style={{ color: "#d4000e" }}>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="details-section">
        <div className="info-box">
          <h4>Customer Info</h4>
          <Typography>
            Customer ID: {customerDetails?.customerId}
            {customerDetails?.customerId && (
              <VerifiedRoundedIcon
                style={{
                  color: "#092e6b",
                  fontSize: "15px",
                  marginLeft: "5px",
                }}
              />
            )}
          </Typography>
          <Typography>
            Name: {customerDetails?.firstName} {customerDetails?.middleName}{" "}
            {customerDetails?.lastName}
          </Typography>
          <Typography>
            Number: {customerDetails?.mobileNumber1}{" "}
            {customerDetails?.mobileNumber2}
          </Typography>
          <Typography>Email: {customerDetails?.email}</Typography>
        </div>

        <div className="info-box">
          <h4>Payment Details</h4>
          <Typography>Grand total: {customerDetails?.grand_total}</Typography>
          <Typography>
            Amount Paid by Customer: {customerDetails?.customer_account_balance}
          </Typography>
          <Typography>
            Amount Unpaid by Customer:{" "}
            {customerDetails
              ? customerDetails.customer_account_balance -
                customerDetails.grand_total
              : 0}
          </Typography>
        </div>

        <div className="info-box">
          <h4>Car Details</h4>
          <Typography>Car Model: {customerDetails?.model}</Typography>
          <Typography>Car Color: {customerDetails?.color}</Typography>
          <Typography>Car Variant: {customerDetails?.version}</Typography>
        </div>

        <div className="info-box">
          <h4>Dealership Advisor</h4>
          <Typography>Team Leader: {customerDetails?.team_Leader}</Typography>
          <Typography>Team Member: {customerDetails?.team_Member}</Typography>
        </div>

        {customerDetails?.exchange === "Yes" && (
          <div className="info-box">
            <h4>Exchange Details</h4>

            <Typography>
            Exchange Amount: {customerDetails.exchangeAmount || "N/A"}{" "}
              <span
                className={
                  customerDetails.exchangeStatus === "Pending"
                    ? "warning"
                    : customerDetails.exchangeStatus === "Approved"
                    ? "success"
                    : customerDetails.exchangeStatus === "Rejected"
                    ? "error"
                    : ""
                }
              >
                {customerDetails.financestatus || "N/A"}
              </span>
            </Typography>

            <Typography>
            carOwnerFullName Reason: {customerDetails.carOwnerFullName || "N/A"}
            </Typography>
            <Typography>
            car details: {customerDetails.carMake || "N/A"} | {customerDetails.carModel || "N/A"} |  {customerDetails.carColor || "N/A"}
            </Typography>
            <Typography>
            car Registration : {customerDetails.carRegistration || "N/A"}
            </Typography>
            <Typography>
            car Year: {customerDetails.carYear || "N/A"}
            </Typography>
           
           
            <Typography>
              Exchange Reason: {customerDetails.exchangeReason || "N/A"}
            </Typography>
          </div>
        )}

        {/* Conditionally render Finance Details */}
        {customerDetails?.finance === "Yes" && (
          <div className="info-box">
            <h4>Finance Details</h4>
            <Typography>
              Loan Amount: {customerDetails.loan_amount || "N/A"}{" "}
              <span
                className={
                  customerDetails.financestatus === "Pending"
                    ? "warning"
                    : customerDetails.financestatus === "Approval"
                    ? "success"
                    : customerDetails.financestatus === "Rejected"
                    ? "error"
                    : ""
                }
              >
                {customerDetails.financestatus || "N/A"}
              </span>
            </Typography>
            <Typography>
              Interest: {customerDetails.interest_rate || "N/A"}
            </Typography>
            <Typography>
              Loan Duration: {customerDetails.loan_duration || "N/A"} Years
            </Typography>
            <Typography>
              Calculated EMI: {customerDetails.calculated_emi || "N/A"}
            </Typography>
            <Typography>
              Finance Reason: {customerDetails.financeReason || "N/A"}
            </Typography>
          </div>
        )}
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
