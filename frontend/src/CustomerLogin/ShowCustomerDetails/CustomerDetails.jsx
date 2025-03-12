

// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem('customer'));
        if (!customer?.customerId) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/PaymentHistory/${customer.customerId}`
        );
        
        setPaymentData(response.data);
      } catch (err) {
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Customer Dashboard</h2>
      
      {/* Customer Information */}
      <div>
        <h3>Personal Information</h3>
        <p>Name: {paymentData.customer.firstName} {paymentData.customer.lastName}</p>
        <p>Customer ID: {paymentData.customer.customerId}</p>
      </div>

      {/* Vehicle Information */}
      <div>
        <h3>Vehicle Details</h3>
        <p>Model: {paymentData.carbooking.model}</p>
        <p>Color: {paymentData.carbooking.color}</p>
        <p>Ex-showroom Price: ₹{paymentData.carbooking.exShowroomPrice}</p>
      </div>

      {/* Payment History */}
      <div>
        <h3>Payment Transactions</h3>
        <ul>
          {paymentData.cashier.map(transaction => (
            <li key={transaction.id}>
              {transaction.transactionType}: ₹
              {transaction.creditedAmount || transaction.debitedAmount}
              ({new Date(transaction.paymentDate).toLocaleDateString()})
            </li>
          ))}
        </ul>
      </div>

      {/* Invoice Summary */}
      <div>
        <h3>Invoice Summary</h3>
        <p>Total Amount: ₹{paymentData.invoicesummary.grand_total}</p>
        <p>Payment Status: {paymentData.invoicesummary.payment_status}</p>
      </div>
    </div>
  );
};

export default Dashboard;