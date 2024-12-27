import React, { useState, useEffect } from "react";
import "./css/CashierApp.scss";
import { useNavigate } from "react-router-dom";

const CashierApp = () => {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(""); // State to handle errors or "no record"

  const handleCustomerIdChange = (e) => {
    setCustomerId(e.target.value);
  };

  useEffect(() => {
    if (customerId) {
      // Reset error and fetch customer details
      setError("");
      fetch(`http://localhost:5000/api/customers/${customerId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Customer not found");
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setCustomerDetails(data);
            setError(""); // Clear any previous error
          } else {
            setCustomerDetails(null);
            setError("No record found for the given Customer ID.");
          }
        })
        .catch((error) => {
          console.error("Error fetching customer details:", error);
          setCustomerDetails(null);
          setError("No record found for the given Customer ID.");
        });
    } else {
      setCustomerDetails(null);
    }
  }, [customerId]);

  const handlePayment = () => {
    if (customerDetails) {
      alert(`Processing payment for Customer ID: ${customerId}`);
      navigate("/PaymentDetails");
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
      </div>

      {error && <p className="error-message">{error}</p>}

      {customerDetails && (
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
      )}

      {customerDetails && (
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
      )}

      {customerDetails && (
        <div className="payment-button-container">
          <button className="payment-button" onClick={handlePayment}>
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default CashierApp;
