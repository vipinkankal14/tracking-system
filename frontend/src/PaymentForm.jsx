// PaymentForm.js
import React, { useState } from 'react';
import axios from 'axios';
import CustomersTable from './CustomersTable';
import CashierTransactionsTable from './CashierTransactionsTable';
import './PaymentForm.scss';
 

 

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    transactionType: "debit", // Default to "Debit"
    amount: "",
    userId: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload =
        formData.transactionType === "debit"
          ? { debitedAmount: formData.amount, userId: formData.userId }
          : { creditedAmount: formData.amount, userId: formData.userId };

      const response = await axios.post("http://localhost:5000/api/payment", payload);
      setResponseMessage(response.data.message);
      setFormData({ transactionType: "debit", amount: "", userId: "" }); // Reset form
    } catch (err) {
      setResponseMessage("Error processing payment.");
      console.error(err);
    }
  };

  return (
    <div>
      <CustomersTable />
      <CashierTransactionsTable />
          

      
      <div className="payment-form-container">
      <h2>Payment Form</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">
            User ID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="transactionType" className="form-label">
            Transaction Type
          </label>
          <select
            id="transactionType"
            name="transactionType"
            value={formData.transactionType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Amount"
            required
          />
        </div>


        <button type="submit" className="btn btn-primary">
          Submit Payment
        </button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
      </div>
      
    </div>
  );
};

export default PaymentForm;
