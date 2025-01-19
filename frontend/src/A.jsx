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
    <div className="payment-details-container">
      <h2>Payment Details</h2>
      <p>
        <strong>Customer ID:</strong> {customerId}{" "}
        {customerId && <VerifiedRoundedIcon style={{ color: "#092e6b" }} />}
      </p>
      <p>
        <strong>Name:</strong> {customerName}
      </p>
      <p>
        <strong>Account Balance:</strong> ₹{newBalance.toFixed(2)}
      </p>

      <form onSubmit={handleSubmit}>
        <label>Payment Type</label>
        <select name="paymentType" value={formData.paymentType} onChange={handleChange}>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="online">Online</option>
        </select>

        <label>Transaction Type</label>
        <select name="transactionType" value={formData.transactionType} onChange={handleChange}>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>

        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          min="0"
        />

        <Button type="submit" variant="contained">
          Submit Payment
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/CashierApp");
          }}
        >
          Cancel
        </Button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default PaymentDetails;
