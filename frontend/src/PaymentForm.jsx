// PaymentForm.js
import React, { useState } from 'react';
import axios from 'axios';
import CashierTransactionsTable from '../CashierTransactionsTable';
import CustomersTable from '../CustomersTable';

 

const PaymentForm = () => {
  const [debitedAmount, setDebitedAmount] = useState('');
  const [userId, setUserId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/payment', {
        debitedAmount,
        userId,
      });

      setStatusMessage(response.data.message);
      setDebitedAmount('');
      setUserId('');
    } catch (error) {
      setStatusMessage('Error: ' + error.response?.data?.error);
    }
  };

  return (
      <div>
          <CashierTransactionsTable />
          <CustomersTable />

      <h2>Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Debited Amount:</label>
          <input
            type="number"
            value={debitedAmount}
            onChange={(e) => setDebitedAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>
      <p>{statusMessage}</p>
    </div>
  );
};

export default PaymentForm;
