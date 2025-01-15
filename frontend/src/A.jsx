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
















.customer-details-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 15px;

  .customer-id-card {
    background-color: #f8f9fa;
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    width: 100%;
    max-width: 300px;

    .customer-id-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ced4da;
      border-radius: 5px;
      font-size: 14px;
    }

    .customer-id-input:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }

  .customer-info,
  .car-details {
    background-color: #ffffff;
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    width: 100%;
    max-width: 400px;

    p {
      margin: 5px 0;
      font-size: 14px;

      strong {
        font-weight: 600;
      }
    }
  }

  .car-details h5 {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .payment-button-container {
    margin-top: 20px;
    width: 100%;
    max-width: 400px;
    display: flex;
    justify-content: center;

    .payment-button {
      background-color: #007bff;
      color: white;
      padding: 10px 10px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}

@media (max-width: 768px) {
  .customer-details-container {
    .customer-id-card,
    .customer-info,
    .car-details,
    .payment-button-container {
      max-width: 100%;
    }
  }
}


.customer-card {
  width: 260px;
  height: 160px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 

   
  // Responsive Design
  @media (min-width: 768px) {
    max-width: 400px; // Desktop width
    .customer-header {
      gap: 12px;
      .customer-avatar {
        width: 36px;
        height: 36px;
        font-size: 0.9rem;
      }
      .customer-name {
        font-size: 1.2rem;
      }
    }
    .customer-details {
      .customer-table td {
        padding: 6px 8px;
      }
    }
  }

  @media (max-width: 768px) {
    max-width: 90%; // Mobile width
    .customer-header {
      .customer-avatar {
        width: 24px;
        height: 24px;
        font-size: 0.7rem;
      }
      .customer-name {
        font-size: 0.9rem;
      }
    }
    .customer-details {
      .customer-table td {
        padding: 4px 4px;
      }
    }
  }
}




