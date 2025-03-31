"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material"
import {
  AccountCircle,
  VerifiedRounded,
  DirectionsCar,
  Payment as PaymentIcon,
  People,
  CompareArrows,
  AccountBalance,
  Receipt,
} from "@mui/icons-material"

 
const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))

  const [customerId, setCustomerId] = useState("")
  const [customerDetails, setCustomerDetails] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCustomerIdChange = (e) => {
    setCustomerId(e.target.value.trim())
    setError("")
  }

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customerId) {
        setCustomerDetails(null)
        setError("Customer ID cannot be empty.")
        return
      }

      setLoading(true)
      setError("")
      try {
        const response = await fetch(`http://localhost:5000/api/customerspay/${customerId}`)

        if (!response.ok) {
          throw new Error(response.status === 404 ? "Customer not found" : "Failed to fetch customer details")
        }

        const { data } = await response.json() // Destructure the response to get the data property

        if (!data) {
          throw new Error("No customer data received")
        }

        // Transform the backend data structure to match frontend expectations
        const transformedData = {
          ...data,
          financestatus: data.loans?.[0]?.status || null,
          exchange_status: data.carExchange?.status || null,
          grand_total: data.invoiceInfo?.grand_total || 0,
          customer_account_balance: data.invoiceInfo?.customer_account_balance || 0,
          model: data.carBooking?.model || null,
          version: data.carBooking?.version || null,
          color: data.carBooking?.color || null,
          exShowroomPrice: data.carBooking?.exShowroomPrice || null,
          bookingAmount: data.carBooking?.bookingAmount || null,
          exchange: data.additional_info?.exchange || "No",
          finance: data.additional_info?.finance || "No",
          exchangeAmount: data.carExchange?.exchangeAmount || null,
          exchangeReason: data.carExchange?.exchangeReason || null,
          carMake: data.carExchange?.carMake || null,
          carModel: data.carExchange?.carModel || null,
          carColor: data.carExchange?.carColor || null,
          carRegistration: data.carExchange?.carRegistration || null,
          carYear: data.carExchange?.carYear || null,
          carOwnerFullName: data.carExchange?.carOwnerFullName || null,
          loan_amount: data.loans?.[0]?.loanAmount || null,
          interest_rate: data.loans?.[0]?.interestRate || null,
          loan_duration: data.loans?.[0]?.duration || null,
          calculated_emi: data.loans?.[0]?.calculatedEMI || null,
          financeReason: data.loans?.[0]?.financeReason || null,
          bookingType: data.carBooking?.bookingType || null,
          team_Leader: data.carBooking?.team_Leader || null,
          team_Member: data.carBooking?.team_Member || null,
          carType: data.carBooking?.carType || null,
          invoice_id: data.invoiceInfo?.invoice_id || null,
          invoice_date: data.invoiceInfo?.invoice_date || null,
          total_on_road_price: data.invoiceInfo?.total_on_road_price || null,
          total_charges: data.invoiceInfo?.total_charges || null,
          payment_status: data.invoiceInfo?.payment_status || null,
        }

        setCustomerDetails(transformedData)
      } catch (err) {
        setCustomerDetails(null)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchCustomerDetails, 500)
    return () => clearTimeout(debounceTimer)
  }, [customerId])

  const handlePayment = () => {
    if (customerDetails) {
      navigate("/payment-details", {
        state: {
          customerId,
          customerName: `${customerDetails.firstName} ${customerDetails.middleName || ""} ${customerDetails.lastName}`,
          customer: `${customerDetails.grand_total}`,
          accountBalance: customerDetails.customer_account_balance,
        },
        replace: true,
      })
    } else {
      alert("Please enter a valid Customer ID.")
    }
  }

  const InfoBox = ({ title, icon, children }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: "100%",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, fontSize: "1rem", fontWeight: "bold" }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Paper>
  )

  const StatusChip = ({ status }) => {
    let color = "default"
    if (status === "Pending") color = "warning"
    else if (status === "Approval" || status === "Approved") color = "success"
    else if (status === "Rejected") color = "error"

    return <Chip size="small" label={status} color={color} sx={{ ml: 1 }} />
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Box className="customer-details-container" sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: "8px" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "flex-end", width: isMobile ? "100%" : "auto" }}>
            <AccountCircle sx={{ color: "primary.main", mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              id="customer-id-input"
              label="Customer ID"
              variant="standard"
              onChange={handleCustomerIdChange}
              placeholder="Enter customer ID"
            />
          </Box>

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Loading customer details...
              </Typography>
            </Box>
          )}
        </Box>

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {customerDetails && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <InfoBox title="Customer Info" icon={<AccountCircle color="primary" />}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>ID:</strong> {customerDetails.customerId}
                  {customerDetails.customerId && (
                    <VerifiedRounded
                      sx={{
                        color: "primary.main",
                        fontSize: "15px",
                        ml: 0.5,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {customerDetails.firstName} {customerDetails.middleName}{" "}
                  {customerDetails.lastName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Numbers:</strong>{" "}
                  {customerDetails.mobileNumbers?.length > 0
                    ? customerDetails.mobileNumbers.join(" / ")
                    : "No numbers available"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {customerDetails.email || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong>{" "}
                  {[customerDetails.address, customerDetails.city, customerDetails.state, customerDetails.country]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </Typography>
              </InfoBox>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InfoBox title="Invoice Details" icon={<Receipt color="primary" />}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Invoice ID:</strong> {customerDetails.invoice_id || "N/A"}
                </Typography>
              
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Payment Status:</strong>
                  <Chip
                    size="small"
                    label={customerDetails.payment_status || "N/A"}
                    color={
                      customerDetails.payment_status === "Paid"
                        ? "success"
                        : customerDetails.payment_status === "Partial"
                          ? "warning"
                          : customerDetails.payment_status === "Unpaid"
                            ? "error"
                            : "default"
                    }
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Total Charges:</strong> {formatCurrency(customerDetails.total_charges)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>On-Road Price:</strong> {formatCurrency(customerDetails.total_on_road_price)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Grand Total:</strong> {formatCurrency(customerDetails.grand_total)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Amount Paid:</strong> {formatCurrency(customerDetails.customer_account_balance)}
                </Typography>

                <Typography>

                  <strong> Amount Unpaid by Customer:</strong>
                  { customerDetails ? customerDetails.customer_account_balance - customerDetails . grand_total : 0 }
                </Typography>
                
              </InfoBox>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InfoBox title="Car Details" icon={<DirectionsCar color="primary" />}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Car Type:</strong> {customerDetails.carType || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Model:</strong> {customerDetails.model || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Color:</strong> {customerDetails.color || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Variant:</strong> {customerDetails.version || "N/A"}
                </Typography>
               
              </InfoBox>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InfoBox title="Dealership Advisor" icon={<People color="primary" />}>
              <Typography variant="body2" sx={{ mb: 1 }} >
                  <strong>Booking Type:</strong> {customerDetails.bookingType || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Team Leader:</strong> {customerDetails.team_Leader || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Team Member:</strong> {customerDetails.team_Member || "N/A"}
                </Typography>
              </InfoBox>
            </Grid>

            {customerDetails.exchange === "YES" && (
              <Grid item xs={12} sm={6} md={4}>
                <InfoBox title="Exchange Details" icon={<CompareArrows color="primary" />}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Exchange Amount:</strong> {formatCurrency(customerDetails.exchangeAmount)}{" "}
                    {customerDetails.exchange_status && <StatusChip status={customerDetails.exchange_status} />}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Owner:</strong> {customerDetails.carOwnerFullName || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Car Details:</strong>{" "}
                    {[customerDetails.carMake, customerDetails.carModel, customerDetails.carColor]
                      .filter(Boolean)
                      .join(" | ") || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Registration:</strong> {customerDetails.carRegistration || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Year:</strong> {customerDetails.carYear || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Reason:</strong> {customerDetails.exchangeReason || "N/A"}
                  </Typography>
                </InfoBox>
              </Grid>
            )}

            {customerDetails.finance === "YES" && (
              <Grid item xs={12} sm={6} md={4}>
                <InfoBox title="Finance Details" icon={<AccountBalance color="primary" />}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Loan Amount:</strong> {formatCurrency(customerDetails.loan_amount)}{" "}
                    {customerDetails.financestatus && <StatusChip status={customerDetails.financestatus} />}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Interest Rate:</strong>{" "}
                    {customerDetails.interest_rate ? `${customerDetails.interest_rate}%` : "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Loan Duration:</strong>{" "}
                    {customerDetails.loan_duration ? `${customerDetails.loan_duration} Years` : "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>EMI:</strong> {formatCurrency(customerDetails.calculated_emi)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Reason:</strong> {customerDetails.financeReason || "N/A"}
                  </Typography>
                </InfoBox>
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handlePayment}
              startIcon={<PaymentIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                "&:hover": {
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                },
              }}
            >
              Proceed to Payment
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Payment

