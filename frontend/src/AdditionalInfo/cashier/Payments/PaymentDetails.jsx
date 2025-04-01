"use client"

import { useState } from "react"
import {
  Button,
  TextField,
  Radio,
  FormControlLabel,
  Grid,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material"
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
  Close,
} from "@mui/icons-material"

const PaymentDetails = ({ open, onClose, customerData }) => {
  const { customerId, customerName, amount, accountBalance } = customerData || {}

  const [formData, setFormData] = useState({
    transactionType: "credit",
    amount: "",
    paymentType: "cash",
  })

  const [newBalance, setNewBalance] = useState(Number.parseFloat(accountBalance) || 0)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setMessage({ type: "", text: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { transactionType, amount, paymentType } = formData
    const parsedAmount = Number.parseFloat(amount)

    if (!parsedAmount || parsedAmount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid positive amount." })
      return
    }

    setProcessing(true)
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
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process payment.")
      }

      const updatedBalance = transactionType === "debit" ? newBalance - parsedAmount : newBalance + parsedAmount

      setNewBalance(updatedBalance)
      setFormData({ transactionType: "credit", paymentType: "cash", amount: "" })
      setMessage({
        type: "success",
        text: `Payment of ₹${parsedAmount} ${transactionType === "debit" ? "debited" : "credited"} successfully.`,
      })

      setPaymentSuccess(true)

      // Close modal after success (optional)
      // setTimeout(() => {
      //   onClose();
      // }, 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "An error occurred while processing the payment." })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={paymentSuccess ? null : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#092e6b",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AttachMoney />
          <Typography variant="h6">Payment Details</Typography>
        </Box>
        {!paymentSuccess && (
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {paymentSuccess ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CheckCircleOutline sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
              {message.text}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              New Balance:{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(newBalance)}
            </Typography>
          </Box>
        ) : (
          <>
            <Box className="customer-info" sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
                      Customer ID:
                    </Typography>
                    <Typography variant="body1">
                      {customerId}
                      <VerifiedRounded sx={{ fontSize: 18, color: "#092e6b", ml: 1, verticalAlign: "middle" }} />
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
                      Name:
                    </Typography>
                    <Typography variant="body1">{customerName}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
                      Total On-Road Price:
                    </Typography>
                    <Typography variant="body1">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(amount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccountBalanceWallet sx={{ fontSize: 18, mr: 1, color: "primary.main" }} />
                    <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
                      Balance:
                    </Typography>
                    <Typography variant="body1">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 2,
                      }).format(newBalance)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            <form className="payment-form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: "bold", display: "flex", alignItems: "center" }}
                  >
                    <CreditCard sx={{ mr: 1 }} /> Payment Method
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {["cash", "card", "UPI"].map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {type === "cash" ? (
                              <AttachMoney sx={{ mr: 1 }} />
                            ) : type === "card" ? (
                              <CreditCard sx={{ mr: 1 }} />
                            ) : (
                              <Wifi sx={{ mr: 1 }} />
                            )}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Box>
                        }
                        checked={formData.paymentType === type}
                        onChange={handleChange}
                        name="paymentType"
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: "bold", display: "flex", alignItems: "center" }}
                  >
                    <AccountBalance sx={{ mr: 1 }} /> Transaction Type
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {["credit", "exchangeCredit", "financeCredit"].map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {type === "credit" ? (
                              <AccountBalanceWallet sx={{ mr: 1 }} />
                            ) : type === "exchangeCredit" ? (
                              <SwapHoriz sx={{ mr: 1 }} />
                            ) : (
                              <AccountBalance sx={{ mr: 1 }} />
                            )}
                            {type.replace("Credit", " Credit")}
                          </Box>
                        }
                        checked={formData.transactionType === type}
                        onChange={handleChange}
                        name="transactionType"
                      />
                    ))}
                  </Box>
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
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupee />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {message.text && (
                  <Grid item xs={12}>
                    <Alert severity={message.type === "error" ? "error" : "success"}>{message.text}</Alert>
                  </Grid>
                )}
              </Grid>
            </form>
          </>
        )}
      </DialogContent>

      {!paymentSuccess && (
        <DialogActions sx={{ p: 3, pt: 0,justifyContent:'space-between' }}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onClose}
            startIcon={<CancelOutlined />}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSubmit}
            disabled={processing || !formData.amount}
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {processing ? "Processing..." : "Process Payment"}
          </Button>
        </DialogActions>
      )}

      {paymentSuccess && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="contained" color="primary" onClick={onClose} fullWidth>
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default PaymentDetails

