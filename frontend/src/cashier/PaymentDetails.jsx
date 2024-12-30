// PaymentDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/PaymentDetails.scss";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract customer details passed via navigation
  const { customerId, customerName, accountBalance } = location.state || {};

  const [formData, setFormData] = useState({
    transactionType: "debit",
    amount: "",
  });

  console.log("Initial accountBalance type:", typeof accountBalance, accountBalance);
  const [newBalance, setNewBalance] = useState(parseFloat(accountBalance) || 0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!customerId || !customerName) {
      navigate("/CashierApp"); // Redirect if no customer data
    }
  }, [customerId, customerName, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const { transactionType, amount } = formData;
  const parsedAmount = parseFloat(amount);

  // Validate inputs
  if (!parsedAmount || parsedAmount <= 0) {
    setError("Please enter a valid positive amount.");
    return;
  }

  const isDebit = transactionType === "debit";

  if (isDebit && parsedAmount > newBalance) {
    setError("Insufficient balance for the debit transaction.");
    return;
  }

  try {
    // Call API to process the payment
    const response = await fetch("http://localhost:5000/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: customerId,
        debitedAmount: isDebit ? parsedAmount : null,
        creditedAmount: !isDebit ? parsedAmount : null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process payment.");
    }
    const result = await response.json(); // Use this only if response is JSON
    console.log("API response:", result);

    console.log("newBalance before transaction:", typeof newBalance, newBalance);
    console.log("Parsed amount:", typeof parsedAmount, parsedAmount);
    
    const updatedBalance = isDebit
      ? parseFloat(newBalance) - parsedAmount
      : parseFloat(newBalance) + parsedAmount;
    
    console.log("updatedBalance after transaction:", typeof updatedBalance, updatedBalance);
    
    setNewBalance(updatedBalance);
    

    setFormData({ transactionType: "debit", amount: "" });
    setError("");
    setSuccess(`Payment of ₹${parsedAmount} ${isDebit ? "debited" : "credited"} successfully.`);

    // Navigate to PaymentSuccessful with correct data
    setTimeout(() => {
      navigate("/PaymentSuccessful", {
        state: {
          transactionType: isDebit ? "Debit" : "Credit",
          amount: parsedAmount,
          updatedBalance: updatedBalance.toFixed(2),
          customerId,
          customerName,
        },
      });
    }, 2000);
  } catch (error) {
    console.error("Error processing payment:", error);
    setError(error.message || "An error occurred while processing the payment.");
  }
};


  return (
    <div className="payment-details-container">
      <h4>Payment Details</h4>
      <p><strong>Customer ID:</strong> {customerId}</p>
      <p><strong>Name:</strong> {customerName} </p>
      <p><strong>Account Balance:</strong> ₹{Number(newBalance).toFixed(2)}</p>

      <form className="payment-form" onSubmit={handleSubmit}>
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

        <div className="form-group mb-3">
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

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" className="payment-button">
          Submit Payment
        </button>
      </form>

    </div>
  );
};

export default PaymentDetails;
