import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PaymentSuccessful = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to navigate back to the dashboard
  const handleGoBack = () => {
    navigate("/"); // Navigate to the dashboard or home page (you can change the route to match your app's routing)
  };

  return (
    <div className="payment-details-container justify-content-center align-content-center">
      <div className="success-info">
        <h2>Payment Successful!</h2>
        <p>Your payment has been processed successfully.</p>
        <p>
          <strong>Payment ID:</strong> 123456789
        </p>
        <button className="btn btn-primary" onClick={handleGoBack}>
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
