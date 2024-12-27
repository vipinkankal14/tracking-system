import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./css/PaymentDetails.scss";

const PaymentDetails = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [paymentType, setPaymentType] = useState("Credit Card");

  const handlePaymentSuccess = () => {
    // Simulate a payment success event
    setIsPaymentSuccessful(true);
    
    // Navigate to PaymentSuccessful page
    navigate("/PaymentSuccessful");
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  return (
    <div className="payment-details-container">
      <div className="payment-details-card">
        <h5>Payment Details</h5>
        <p>
          <strong>Payment Date:</strong> 2024-12-27
        </p>
        <p>
          <strong>Payment Type:</strong>
          <select
            value={paymentType}
            onChange={handlePaymentTypeChange}
            className="payment-type-dropdown"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </p>
      </div>

      <div className="debited-amount-card">
        <h6>Debited Amount</h6>
        <p><strong>$500</strong></p>
      </div>

      {isPaymentSuccessful ? (
        <div className="success-info">
          <p>
            <strong>Name:</strong> Vipin Bharat Kankal
          </p>
          <p>
            <strong>Payment ID:</strong> 123456789
          </p>
          <button className="btn btn-primary">Continue</button>
        </div>
      ) : (
        <button
          className="btn btn-success complete-payment-btn"
          onClick={handlePaymentSuccess}
        >
          Complete Payment
        </button>
      )}
    </div>
  );
};

export default PaymentDetails;
