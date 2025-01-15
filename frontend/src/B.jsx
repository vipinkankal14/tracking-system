import React, { useState, useEffect } from "react";
import "./css/Payment.scss";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleCustomerIdChange = (e) => {
    setCustomerId(e.target.value.trim());
    setError(""); // Clear error when typing
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
      navigate("/PaymentDetails", {
        state: {
          customerId,
          customerName: `${customerDetails.firstName} ${customerDetails.middleName} ${customerDetails.lastName}`,
          accountBalance: customerDetails.accountBalance,
        },
      });
    } else {
      alert("Please enter a valid Customer ID.");
    }
  };
  

  return (
    <div className="customer-details-container">
      <h6>Search Customer</h6>
      <div className="customer-id-card">
        <input
          id="customer-id-input"
          type="text"
          placeholder="Enter Customer ID or Full Name"
          value={customerId}
          onChange={handleCustomerIdChange}
          className="customer-id-input"
        />
        {loading && <p className="loading-message">Loading...</p>}
      </div>

      {error && <p className="error-message">{error}</p>}

      {customerDetails && (
        <>
          <div className="customer-info">
            <p>
              <strong>Name:</strong> {customerDetails.firstName} {customerDetails.middleName} {customerDetails.lastName}
            </p>
            <p>
              <strong>Number:</strong> {customerDetails.mobileNumber1}
            </p>
            <p>
              <strong>Email:</strong> {customerDetails.email}
            </p>
            <p>
              <strong>Account Balance:</strong> {customerDetails.accountBalance}
            </p>
          </div>

          <div className="car-details">
            <p>
              <strong>Car Model:</strong> {customerDetails.model}
            </p>
            <p>
              <strong>Car Color:</strong> {customerDetails.color}
            </p>
            <p>
              <strong>Car Variant:</strong> {customerDetails.variant}
            </p>
            <p>
              <strong>Car Price:</strong> {customerDetails.exShowroomPrice}
            </p>
          </div>

          <div className="payment-button-container">
            <button className="payment-button" onClick={handlePayment}>
              Proceed to Payment
            </button>
          </div>
        </>
      )}
          
    </div>
  );
};

export default Payment;
