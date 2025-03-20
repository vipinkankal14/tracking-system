import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  Radio,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  VerifiedRounded,
  AttachMoney,
  CreditCard,
  Wifi,
  AccountBalance,
  SwapHoriz,
  AccountBalanceWallet,
  CurrencyRupee,
  CheckCircleOutline,
  CancelOutlined,
  Send,
  ArrowBack,
} from "@mui/icons-material";
import "../css/PaymentDetails.scss";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId, customerName, accountBalance, customer } = location.state || {};

  const [formData, setFormData] = useState({
    transactionType: "credit",
    amount: "",
    paymentType: "cash",
  });

  const [newBalance, setNewBalance] = useState(parseFloat(accountBalance) || 0);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!customerId || !customerName || !customer) {
      navigate("/CashierApp", { replace: true });
    }
  }, [customerId, customerName, customer, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { transactionType, amount, paymentType } = formData;
    const parsedAmount = parseFloat(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid positive amount." });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          debitedAmount: transactionType === "debit" ? parsedAmount : null,
          creditedAmount: transactionType !== "debit" ? parsedAmount : null,
          paymentType,
          transactionType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process payment.");
      }

      const updatedBalance = transactionType === "debit"
        ? newBalance - parsedAmount
        : newBalance + parsedAmount;

      setNewBalance(updatedBalance);
      setFormData({ transactionType: "credit", paymentType: "cash", amount: "" });
      setMessage({
        type: "success",
        text: `Payment of ₹${parsedAmount} ${
          transactionType === "debit" ? "debited" : "credited"
        } successfully.`,
      });

      setTimeout(() => {
        navigate("/payment-successful", {
          state: { transactionType, amount: parsedAmount, updatedBalance, customerId, customerName, customer },
          replace: true,
        });
      }, 2000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "An error occurred while processing the payment." });
    }
  };

  return (
    <div className="payment-details-container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/Payment")} sx={{ color: "#092e6b" }}>
          <ArrowBack />
        </IconButton>
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <AttachMoney fontSize="small" /> Payment Details
        </span>
      </div>
      <br />

      <div className="customer-info">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p className="info-item">
              <strong>Customer ID:</strong> {customerId}
              <VerifiedRounded sx={{ fontSize: 18, color: "#092e6b", ml: 1 }} />
            </p>
            <p className="info-item"><strong>Name:</strong> {customerName}</p>
            <p className="info-item"><strong>Total On-Road Price:</strong> {customer}</p>
            <p className="info-item">
              <AccountBalanceWallet sx={{ fontSize: 18, mr: 1 }} />
              <strong>Balance:</strong> ₹{newBalance.toFixed(2)}
            </p>
          </Grid>
        </Grid>
      </div>

      <form className="payment-form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <h4 className="section-title"><CreditCard sx={{ mr: 1 }} /> Payment Method</h4>
            <div className="radio-group">
              {["cash", "card", "UPI"].map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio />}
                  label={<div className="radio-label">{type === "cash" ? <AttachMoney sx={{ mr: 1 }} /> : type === "card" ? <CreditCard sx={{ mr: 1 }} /> : <Wifi sx={{ mr: 1 }} />} {type.charAt(0).toUpperCase() + type.slice(1)}</div>}
                  checked={formData.paymentType === type}
                  onChange={handleChange}
                  name="paymentType"
                />
              ))}
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <h4 className="section-title"><AccountBalance sx={{ mr: 1 }} /> Transaction Type</h4>
            <div className="radio-group">
              {["credit", "exchangeCredit", "financeCredit"].map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio />}
                  label={<div className="radio-label">{type === "credit" ? <AccountBalanceWallet sx={{ mr: 1 }} /> : type === "exchangeCredit" ? <SwapHoriz sx={{ mr: 1 }} /> : <AccountBalance sx={{ mr: 1 }} />} {type.replace("Credit", " Credit")}</div>}
                  checked={formData.transactionType === type}
                  onChange={handleChange}
                  name="transactionType"
                />
              ))}
            </div>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount"
              variant="outlined"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><CurrencyRupee /></InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Button type="submit" variant="contained" color="primary" >Process Payment</Button>
            <Button variant="outlined" color="error" startIcon={<CancelOutlined />} onClick={() => navigate("/Payment")}>Cancel</Button>
          </Grid>

          {message.text && (
            <Grid item xs={12}>
              <Alert severity={message.type === "error" ? "error" : "success"}>{message.text}</Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </div>
  );
};

export default PaymentDetails;
