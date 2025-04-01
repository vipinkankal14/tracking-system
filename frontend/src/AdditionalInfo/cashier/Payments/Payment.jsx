"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Container,
} from "@mui/material";
import {
  AccountCircle,
  VerifiedRounded,
  DirectionsCar,
  Payment as PaymentIcon,
  CompareArrows,
  AccountBalance,
  Receipt,
} from "@mui/icons-material";
import PaymentDetails from "./PaymentDetails";
import { ArrowBack } from '@mui/icons-material';
import { color } from "framer-motion";


// utils/dateUtils.js
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [otpValue, setOtpValue] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);

  // State for payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    // Auto-focus first input on mount
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp.join(""));

    // Auto-tab to next input
    if (value && index < 9) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 10);
    if (/^\d+$/.test(pasteData)) {
      setOtpValue(pasteData);
      // Fill all inputs with pasted data
      Array.from({ length: pasteData.length }).forEach((_, i) => {
        const input = document.getElementById(`otp-input-${i}`);
        if (input) input.value = pasteData[i];
      });
      // Focus next available input
      if (pasteData.length < 10) {
        document.getElementById(`otp-input-${pasteData.length}`)?.focus();
      }
    }
  };

  const handleVerify = () => {
    setCustomerId(otpValue);
    setLoading(true);
    setError("");
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customerId || customerId.length < 10) {
        setCustomerDetails(null);
        setError(customerId ? "Customer ID must be 10 digits" : "");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/customerspay/${customerId}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Customer not found"
              : "Failed to fetch customer details"
          );
        }

        const { data } = await response.json();

        if (!data) {
          throw new Error("No customer data received");
        }

        const transformedData = {
          ...data,
          financestatus: data.loans?.[0]?.status || null,
          exchange_status: data.carExchange?.status || null,
          grand_total: data.invoiceInfo?.grand_total || 0,
          customer_account_balance:
            data.invoiceInfo?.customer_account_balance || 0,
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
          order_date: data.orderPrebooking?.orderDate || "NO",
          tentative_date: data.orderPrebooking?.tentativeDate || null,
          preferred_date: data.orderPrebooking?.preferredDate || null,
          request_date: data.orderPrebooking?.requestDate || null,
          prebooking: data.orderPrebooking?.prebooking || "NO",
          prebooking_date: data.orderPrebooking?.prebookingDate || null,
          delivery_date: data.orderPrebooking?.deliveryDate || null,
          order_prebooking_created: data.orderPrebooking?.createdAt || null,
        };
        setCustomerDetails(transformedData);
      } catch (err) {
        setCustomerDetails(null);
        setError(err.message);
        // Clear OTP on error
        setOtpValue("");
        Array.from({ length: 10 }).forEach((_, i) => {
          const input = document.getElementById(`otp-input-${i}`);
          if (input) input.value = "";
        });
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  // Modified to open modal instead of navigating
  const handlePayment = () => {
    if (customerDetails) {
      setPaymentModalOpen(true);
    }
  };

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
        <Typography
          variant="h6"
          sx={{ ml: 1, fontSize: "1rem", fontWeight: "bold" }}
        >
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Paper>
  );

  const StatusChip = ({ status }) => {
    let color = "default";
    if (status === "Pending") color = "warning";
    else if (status === "Approval" || status === "Approved") color = "success";
    else if (status === "Rejected") color = "error";

    return <Chip size="small" label={status} color={color} sx={{ ml: 1 }} />;
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box className="customer-details-container" sx={{ p: 2 }}>
      <Box className="customer-details-container" sx={{ p: 2 }}>
      <Button
        variant="text"
        color="primary"
        size="small"
        onClick={() => navigate(-1)} // Goes back to previous page
        startIcon={<ArrowBack />} 
        sx={{
          px: 2,
          py: 1,
          borderRadius: "8px",
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
            backgroundColor: "action.hover",
          },
        }}
      >
        Back
        </Button>
        </Box>
      {/* Centered Search Box */}
      <Container
  maxWidth="md"
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "20vh",
    px: 2, // Add horizontal padding on mobile
  }}
      >
        <Box
          elevation={3}
          sx={{
            width: "100%",
            borderRadius: "12px",
            textAlign: "center",
        
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Customer Payment Search
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              maxWidth: "500px",
              mx: "auto",
              p: 0,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
              Enter 10-digit Customer ID
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 0.55,
                width: "110%",
              }}
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <TextField
                  key={index}
                  inputRef={index === 0 ? firstInputRef : null}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1rem",
                      padding: "0px",
                    },
                  }}
                  variant="outlined"
                  sx={{
                    width: "40px",
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !e.target.value && index > 0) {
                      document
                        .getElementById(`otp-input-${index - 1}`)
                        ?.focus();
                    }
                  }}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onPaste={handleOtpPaste}
                  id={`otp-input-${index}`}
                />
              ))}
            </Box>

            <Button
              variant="contained"
              sx={{ mt: 2, width: "100%", maxWidth: "200px" }}
              onClick={handleVerify}
              disabled={otpValue.length < 10 || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Verify ID"}
            </Button>
          </Box>

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Container>

      {/* Customer Details Section */}
      {customerDetails && (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Customer Info Box */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoBox
                title="Customer Info"
                icon={<AccountCircle color="primary" />}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>ID:</strong> {customerDetails.customerId}
                  <VerifiedRounded
                    sx={{ color: "primary.main", fontSize: "15px", ml: 0.5 }}
                  />
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {customerDetails.firstName}{" "}
                  {customerDetails.middleName} {customerDetails.lastName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Contact:</strong>{" "}
                  {customerDetails.mobileNumber1 || "N/A"}
                  {customerDetails.mobileNumber2 &&
                    ` / ${customerDetails.mobileNumber2}`}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {customerDetails.email || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong>{" "}
                  {[
                    customerDetails.address,
                    customerDetails.city,
                    customerDetails.state,
                    customerDetails.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </Typography>
              </InfoBox>
            </Grid>

            {/* Car Information Box */}
            <Grid item xs={12} md={8}>
              <InfoBox
                title="Car Information"
                icon={<DirectionsCar color="primary" />}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1.5,
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      Car Details
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      <strong>Type:</strong> {customerDetails.carType || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      <strong>Model:</strong> {customerDetails.model || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      <strong>Color:</strong> {customerDetails.color || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      <strong>Variant:</strong>{" "}
                      {customerDetails.version || "N/A"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1.5,
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      Order Info
                    </Typography>
                    {customerDetails.order_date === "YES" && (
                      <Typography variant="body2" sx={{ mb: 1.5 }}>
                        <strong>Order date:</strong>{" "}
                         <Chip
                        label={
                          customerDetails.order_date === "YES" ? "Yes" : "No"
                        }
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor:
                            customerDetails.order_date === "YES"
                              ? "success.light"
                              : "grey.300",
                        }}
                      />
                      </Typography>
                    )}

                    {customerDetails.tentative_date && (
                      <Typography variant="body2" sx={{ mb: 1.5 }}>
                        <strong>Tentative date:</strong>{" "}
                        {formatDate(customerDetails.tentative_date)}
                      </Typography>
                    )}

                    {customerDetails.preferred_date && (
                      <Typography variant="body2" sx={{ mb: 1.5 }}>
                        <strong>Preferred date:</strong>{" "}
                        {formatDate(customerDetails.preferred_date)}
                      </Typography>
                    )}

                    {customerDetails.request_date && (
                      <Typography variant="body2" sx={{ mb: 1.5 }}>
                        <strong>Request date:</strong>{" "}
                        {formatDate(customerDetails.request_date)}
                      </Typography>
                    )}
 

                    {customerDetails.prebooking === "YES"  && (
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      <strong>Prebooking:</strong>
                      <Chip
                        label={
                          customerDetails.prebooking === "YES" ? "Yes" : "No"
                        }
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor:
                            customerDetails.prebooking === "YES"
                              ? "success.light"
                              : "grey.300",
                        }}
                      />
                      </Typography>
                    )}
                    {customerDetails.prebooking_date && (
                      <Typography variant="body2" sx={{ mb: 1.5 }}>
                        <strong>Prebooked:</strong>{" "}
                        {formatDate(customerDetails.prebooking_date)}
                      </Typography>
                    )}
                    {customerDetails.delivery_date && (
                      <Typography variant="body2" sx={{ mb: 1.5 }}>
                        <strong>Delivery:</strong>{" "}
                        {formatDate(customerDetails.delivery_date)}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1.5,
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      Dealership Team
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      <strong>Booking Type:</strong>
                      <Chip
                        label={customerDetails.bookingType}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      <strong>Team Leader:</strong>
                      <Box component="span" sx={{ fontWeight: 500, ml: 1 }}>
                        {customerDetails.team_Leader || "Not assigned"}
                      </Box>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      <strong>Team Member:</strong>
                      <Box component="span" sx={{ fontWeight: 500, ml: 1 }}>
                        {customerDetails.team_Member || "Not assigned"}
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </InfoBox>
            </Grid>

            {/* Invoice Details Box */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoBox
                title="Invoice Details"
                icon={<Receipt color="primary" />}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Invoice ID:</strong>{" "}
                  {customerDetails.invoice_id || "N/A"}
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
                  <strong>Total Charges:</strong>{" "}
                  {formatCurrency(customerDetails.total_charges)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>On-Road Price:</strong>{" "}
                  {formatCurrency(customerDetails.total_on_road_price)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Grand Total:</strong>{" "}
                  {formatCurrency(customerDetails.grand_total)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Amount Paid:</strong>{" "}
                 <sanp style={{ color:'green' }}>{formatCurrency(customerDetails.customer_account_balance)}</sanp>
                </Typography>
                <Typography variant="body2">
                  <strong>UnPaid Balance:</strong>{" "}
                  <sanp style={{ color:'red' }}> {formatCurrency(
                    customerDetails.grand_total -
                      customerDetails.customer_account_balance
                  )} </sanp>
                </Typography>
              </InfoBox>
            </Grid>

            {/* Conditional Exchange Details Box */}
            {customerDetails.exchange === "YES" && (
              <Grid item xs={12} sm={6} md={4}>
                <InfoBox
                  title="Exchange Details"
                  icon={<CompareArrows color="primary" />}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Exchange Amount:</strong>{" "}
                    {formatCurrency(customerDetails.exchangeAmount)}
                    {customerDetails.exchange_status && (
                      <StatusChip status={customerDetails.exchange_status} />
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Owner:</strong>{" "}
                    {customerDetails.carOwnerFullName || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Vehicle:</strong>{" "}
                    {[
                      customerDetails.carMake,
                      customerDetails.carModel,
                      customerDetails.carColor,
                    ]
                      .filter(Boolean)
                      .join(" | ") || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Registration:</strong>{" "}
                    {customerDetails.carRegistration || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Year:</strong> {customerDetails.carYear || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Reason:</strong>{" "}
                    {customerDetails.exchangeReason || "N/A"}
                  </Typography>
                </InfoBox>
              </Grid>
            )}

            {/* Conditional Finance Details Box */}
            {customerDetails.finance === "YES" && (
              <Grid item xs={12} sm={6} md={4}>
                <InfoBox
                  title="Finance Details"
                  icon={<AccountBalance color="primary" />}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Loan Amount:</strong>{" "}
                    {formatCurrency(customerDetails.loan_amount)}
                    {customerDetails.financestatus && (
                      <StatusChip status={customerDetails.financestatus} />
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Interest Rate:</strong>{" "}
                    {customerDetails.interest_rate
                      ? `${customerDetails.interest_rate}%`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Term:</strong>{" "}
                    {customerDetails.loan_duration
                      ? `${customerDetails.loan_duration} Years`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>EMI:</strong>{" "}
                    {formatCurrency(customerDetails.calculated_emi)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Purpose:</strong>{" "}
                    {customerDetails.financeReason || "N/A"}
                  </Typography>
                </InfoBox>
              </Grid>
            )}
          </Grid>

          {/* Payment Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              mb: 4,
              gap: 2, // Adds spacing between buttons
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={() => navigate(-0)} // Goes back to previous page
              sx={{
            
                borderRadius: "8px",
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                  backgroundColor: "action.hover",
                },
              }}
            >
              Cancel
            </Button>

            {/* Payment Button */}
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handlePayment}
              startIcon={<PaymentIcon />}
              sx={{
               fontSize:'13px',
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
        </Container>
      )}

      {/* Payment Modal */}
      {customerDetails && (
        <PaymentDetails
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          customerData={{
            customerId,
            customerName: `${customerDetails.firstName} ${
              customerDetails.middleName || ""
            } ${customerDetails.lastName}`,
            amount: customerDetails.grand_total,
            accountBalance: customerDetails.customer_account_balance,
          }}
        />
      )}
    </Box>
  );
};

export default Payment;
