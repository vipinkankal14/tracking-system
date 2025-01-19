import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import "./css/PaymentDetails.scss";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId, customerName, accountBalance } = location.state || {};

  const [formData, setFormData] = useState({
    transactionType: "debit",
    amount: "",
    paymentType: "cash",
  });

  const [newBalance, setNewBalance] = useState(parseFloat(accountBalance) || 0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!customerId || !customerName) {
      navigate("/CashierApp");
    }
  }, [customerId, customerName, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { transactionType, amount, paymentType } = formData;
    const parsedAmount = parseFloat(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          debitedAmount: transactionType === "debit" ? parsedAmount : null,
          creditedAmount: transactionType === "credit" ? parsedAmount : null,
          paymentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process payment.");
      }

      const updatedBalance =
        transactionType === "debit"
          ? newBalance - parsedAmount
          : newBalance + parsedAmount;

      setNewBalance(updatedBalance);
      setFormData({ transactionType: "debit", paymentType: "cash", amount: "" });
      setSuccess(
        `Payment of ₹${parsedAmount} ${transactionType === "debit" ? "debited" : "credited"} successfully.`
      );

      setTimeout(() => {
        navigate("/payment-successful", {
          state: { transactionType, amount: parsedAmount, updatedBalance, customerId, customerName },
        });
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred while processing the payment.");
    }
  };

  return (
    <div className="payment-details-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
      <p style={{ color: '' }}>Payment Details</p>
      <p
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <strong>Customer ID: {customerId}</strong>
        {customerId && (
          <VerifiedRoundedIcon style={{ color: '#092e6b', fontSize: '15px' }} />
        )}
      </p>      <p><strong>Name:</strong> {customerName} </p>
      <p><strong>Account Balance:</strong> ₹{Number(newBalance).toFixed(2)}</p>

      <form className="payment-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        <div className="mb-1">
          
        <div className="mb-1">
          <label htmlFor="paymentType" className="form-label">
            Payment Type
          </label>
          <select
            id="paymentType"
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
        </div>


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

        <div className="form-group mb-1">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="form-control"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group mb-3" style={{ display: 'flex', gap: '10px' }}>
          <Button type="submit" variant="contained">Submit Payment</Button>
          <Button
  onClick={() => {
    setFormData({ transactionType: "debit", amount: "" }); // Clear form data
    setError(""); // Clear error messages
    setSuccess(""); // Clear success messages
    navigate("/Payment"); // Navigate to the desired route
  }}
  variant="outlined"
>
  Cancel
</Button>
        </div>
        <div style={{ color: '#d4000e', fontSize: '14px', marginTop: '-20px' }}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      </form>
    </div>
  );
};

export default PaymentDetails;
