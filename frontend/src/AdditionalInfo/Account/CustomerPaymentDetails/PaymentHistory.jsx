import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Added axios import
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  TablePagination,
  TextareaAutosize,
} from "@mui/material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import "../css/PaymentHistory.scss";
import { Modal } from "react-bootstrap";

// Mapping function for transactionType
const formatTransactionType = (type) => {
  switch (type) {
    case "exchangeCredit":
      return "Exchange Credit";
    case "financeCredit":
      return "Finance Credit";
    case "credit":
      return "Credit";
    case "debit":
      return "Debit";
    default:
      return type; // Fallback for unknown types
  }
};

function PaymentHistory() {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [carBookingData, setCarBookingData] = useState(null);
  const [additionalInfoData, setAdditionalInfoData] = useState(null);
  const [onRoadPriceSummary, setOnRoadPriceSummary] = useState(null);
  const [chargesSummary, setChargesSummary] = useState(null);
  const [invoiceSummary, setInvoiceSummary] = useState(null);
  const [ordersprebookingdate, setOrdersprebookingdate] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Rejected Modal
  const [showModal, setShowModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // State for Refund Modal
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const fetchCustomerData = async () => {
    if (!customerId) {
      setError("Customer ID is undefined.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/PaymentHistory/${customerId}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching customer data: ${response.status}`);
      }
      const data = await response.json();

      // Set data from the API response
      setCustomerData(data.customer);
      setCarBookingData(data.carbooking);
      setAdditionalInfoData(data.additionalInfo);
      setInvoiceSummary(data.invoicesummary);
      setOrdersprebookingdate(data.ordersprebookingdate);
      // Inside fetchCustomerData function
      setOnRoadPriceSummary(data.onRoadPriceDetails);
      setChargesSummary(data.additionalCharges);

      setPayments(
        data.cashier.map((item) => ({
          id: item.id,
          debitedAmount: Number(item.debitedAmount) || 0,
          creditedAmount: Number(item.creditedAmount) || 0,
          paymentDate: item.paymentDate,
          transactionType: item.transactionType,
          paymentType: item.paymentType,
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const handleUpdateStatus = async (status) => {
    try {
      const payload = {
        status,
        cancellationReason: status === "rejected" ? cancellationReason : null,
      };
      console.log("Sending payload:", payload); // Log the payload

      const response = await axios.put(
        `http://localhost:5000/api/account/update-status/${customerId}`,
        payload
      );

      console.log("Backend response:", response.data); // Log the response
      if (response.status === 200) {
        alert(`Status updated to ${status} successfully!`);
        if (status === "rejected") {
          setShowModal(false);
          setCancellationReason("");
        }
        fetchCustomerData();
      }
    } catch (err) {
      console.error("Error updating status:", err); // Log the error
      setError(`Failed to update status: ${err.message}`);
    }
  };

  // Add this refund handler function
  const handleRefundConfirmation = async () => {
    if (!isConfirmed) {
      setError("Please confirm the refund.");
      return;
    }

    if (!refundAmount || isNaN(refundAmount) || refundAmount <= 0) {
      setError("Please enter a valid refund amount.");
      return;
    }

    try {
      const response = await axios.put(
        ` http://localhost:5000/api/refund/update-status/${customerId}`,
        {
          status: "refunded", // You can dynamically set this based on user input
          refundReason,
          refundAmount: parseFloat(refundAmount),
        }
      );

      if (response.status === 200) {
        alert("Refund status updated successfully!");
        setShowRefundModal(false);
        setRefundAmount("");
        setRefundReason("");
        setIsConfirmed(false);
        setError(null);
      }
    } catch (err) {
      setError(
        `Failed to update refund status: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setCancellationReason("");
    setIsConfirmed(false);
    setError(null);
    setShowRefundModal(false);
    setRefundAmount("");
    setRefundReason("");

    setError(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching customer data: {error}</div>;

  const {
    firstName = "N/A",
    middleName = "",
    lastName = "N/A",
    customertype = "N/A",
    birthDate = "N/A",
    email = "N/A",
    mobileNumber1 = "N/A",
    mobileNumber2 = "",
    address = "N/A",
    city = "N/A",
    state = "N/A",
    country = "N/A",
  } = customerData || {};

  const {
    model = "N/A",
    version = "N/A",
    color = "N/A",
    team_Member = "N/A",
    team_Leader = "N/A",
  } = carBookingData || {};

  const {
    exchange = "N/A",
    finance = "N/A",
    accessories = "N/A",
    coating = "N/A",
    auto_card = "N/A",
    extended_warranty = "N/A",
    rto = "N/A",
    fast_tag = "N/A",
    insurance = "N/A",
  } = additionalInfoData || {};

  const {
    total_charges = "N/A",
    total_on_road_price = "N/A",
    customer_account_balance = "N/A",
    invoice_date = "N/A",
    due_date = "N/A",
    grand_total = "N/A",
    payment_status = "N/A",
  } = invoiceSummary || {};

  const {
    prebooking = "N/A",
    prebooking_date = "N/A",
    delivery_date = "N/A",
    tentative_date = "N/A",
    preferred_date = "N/A",
    request_date = "N/A",
    order_date = "N/A",
  } = ordersprebookingdate || {};

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <>
      <div className="payment-history">
        <div className="header">
          <Typography variant="h6">
            Payment History for{" "}
            <span style={{ color: "red" }}>{`${firstName || ""} ${
              lastName || ""
            }`}</span>
          </Typography>
        </div>

        <div className="details-container">
          <Grid container spacing={3}>
           { /* Customer Details */}
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Customer Details
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                      <TableBody>
                        <TableRow>
                        <TableCell>
                          <strong>Customer ID:</strong> {customerId || "N/A"}{" "}
                          <VerifiedRoundedIcon
                          style={{
                            color: "#092e6b",
                            fontSize: "15px",
                            marginTop: "-3px",
                            marginRight: "-4px",
                          }}
                          />
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell>
                          <strong>Customer Type:</strong>{" "}
                          {customertype || "N/A"}
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell>
                          <strong>Full Name:</strong>{" "}
                          {`${firstName || "N/A"} ${middleName || ""} ${
                          lastName || ""
                          }`}
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell>
                          <strong>Birth Date:</strong> {formatDate(birthDate || "N/A")}
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell>
                          <strong>Email:</strong> {email || "N/A"}
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell>
                          <strong>Phone:</strong> {mobileNumber1 || "N/A"},{" "}
                          {mobileNumber2 || "N/A"}
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell
                          sx={{
                          maxWidth: "200px",
                          whiteSpace: "normal", // Allow text to wrap
                          wordWrap: "break-word", // Break long words if necessary
                          }}
                        >
                          <strong>Address:</strong>{" "}
                          {`${address || "N/A"}`.split(",").map((line, index) => (
                          <React.Fragment key={index}>
                            {line.trim()}
                            <br />
                          </React.Fragment>
                          ))}
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell>
                          <strong>State:</strong>{" "}
                          {`${state || "N/A"}, ${country || "N/A"}`}
                        </TableCell>
                        </TableRow>
                      </TableBody>
                      </Table>
                    </TableContainer>
                    </Paper>
                  </Grid>

                  {/* Car Details */}
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <strong>Car Details</strong>
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <strong>Car Model:</strong> {model || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Car Variant:</strong> {version || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Car Color:</strong> {color || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Team Member:</strong> {team_Member || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Team Leader:</strong> {team_Leader || "N/A"}
                        </TableCell>
                      </TableRow>
                      {prebooking === "YES" && (
                        <>
                          <TableRow>
                            <TableCell>
                              <strong>Pre Booking:</strong>{" "}
                              {prebooking || "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Prebooking date:</strong>{" "}
                              {formatDate(prebooking_date || "N/A")}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Delivery date:</strong>{" "}
                              {formatDate(delivery_date || "N/A")}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                      {order_date === "YES" && (
                        <>
                          <TableRow>
                            <TableCell>
                              <strong>Order Dates:</strong>{" "}
                              {order_date || "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Tentative Date:</strong>{" "}
                              {formatDate(tentative_date || "N/A")}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Preferred Date:</strong>{" "}
                              {formatDate(preferred_date || "N/A")}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Request Date:</strong>{" "}
                              {formatDate(request_date || "N/A")}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <strong>Additional Details</strong>
                </Typography>

                <TableContainer>
                  <Table size="small">
                     
                    <TableBody>
                      {/* Extended Warranty */}
                      <TableRow>
                        <TableCell>
                          <strong>Extended Warranty</strong>
                        </TableCell>
                        <TableCell align="right">
                          {extended_warranty || "N/A"}
                        </TableCell>
                      </TableRow>

                      {/* Exchange */}
                      <TableRow>
                        <TableCell>
                          <strong>Exchange</strong>
                        </TableCell>
                        <TableCell align="right">{exchange || "N/A"}</TableCell>
                      </TableRow>

                      {/* Finance */}
                      <TableRow>
                        <TableCell>
                          <strong>Finance</strong>
                        </TableCell>
                        <TableCell align="right">{finance || "N/A"}</TableCell>
                      </TableRow>

                      {/* Accessories */}
                      <TableRow>
                        <TableCell>
                          <strong>Accessories</strong>
                        </TableCell>
                        <TableCell align="right">
                          {accessories || "N/A"}
                        </TableCell>
                      </TableRow>

                      {/* Coating */}
                      <TableRow>
                        <TableCell>
                          <strong>Coating</strong>
                        </TableCell>
                        <TableCell align="right">{coating || "N/A"}</TableCell>
                      </TableRow>

                      {/* Auto Card */}
                      <TableRow>
                        <TableCell>
                          <strong>Auto Card</strong>
                        </TableCell>
                        <TableCell align="right">
                          {auto_card || "N/A"}
                        </TableCell>
                      </TableRow>

                      {/* RTO Tax */}
                      <TableRow>
                        <TableCell>
                          <strong>RTO Tax</strong>
                        </TableCell>
                        <TableCell align="right">{rto || "N/A"}</TableCell>
                      </TableRow>

                      {/* Fast Tag */}
                      <TableRow>
                        <TableCell>
                          <strong>Fast Tag</strong>
                        </TableCell>
                        <TableCell align="right">{fast_tag || "N/A"}</TableCell>
                      </TableRow>

                      {/* Insurance */}
                      <TableRow>
                        <TableCell>
                          <strong>Insurance</strong>
                        </TableCell>
                        <TableCell align="right">
                          {insurance || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* On-Road Price Details Table */}
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  On-Road Price Details
                </Typography>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Description
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Amount (₹)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Ex-showroom Price</TableCell>
                        <TableCell align="right">
                          {formatCurrency(
                            onRoadPriceSummary?.ex_showroom_price
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Accessories</TableCell>
                        <TableCell align="right">
                          {formatCurrency(onRoadPriceSummary?.accessories)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Discount</TableCell>
                        <TableCell align="right">
                          {formatCurrency(onRoadPriceSummary?.discount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Subtotal</TableCell>
                        <TableCell align="right">
                          {formatCurrency(onRoadPriceSummary?.subtotal)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          GST (
                          <span style={{ color: "red" }}>
                            {onRoadPriceSummary?.gst_rate || 0}%
                          </span>{" "}
                          of Subtotal)
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(onRoadPriceSummary?.gst_amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          Cess (
                          <span style={{ color: "red" }}>
                            {onRoadPriceSummary?.cess_rate || 0}%
                          </span>{" "}
                          of Subtotal)
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(onRoadPriceSummary?.cess_amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Total On-Road Price
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {formatCurrency(
                            onRoadPriceSummary?.total_on_road_price
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Additional Charges Table */}
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Additional Charges
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Charges
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Amount (₹)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Coating</TableCell>
                        <TableCell align="right">
                          {formatCurrency(chargesSummary?.coating)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>FastTag</TableCell>
                        <TableCell align="right">
                          {formatCurrency(chargesSummary?.fast_tag)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>RTO</TableCell>
                        <TableCell align="right">
                          {formatCurrency(chargesSummary?.rto)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Insurance</TableCell>
                        <TableCell align="right">
                          {formatCurrency(chargesSummary?.insurance)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Extended Warranty</TableCell>
                        <TableCell align="right">
                          {formatCurrency(chargesSummary?.extended_warranty)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Auto Card</TableCell>
                        <TableCell align="right">
                          {formatCurrency(chargesSummary?.auto_card)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Total Charges
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {formatCurrency(chargesSummary?.total_charges)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Debited Details */}
          <Paper className="lines" style={{ flex: 1 }}>
            <Typography
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
                marginBottom: "10px",
              }}
            >
              <strong>Debited Details ( REFUND )</strong>
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Debited Amount</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Transaction Type</TableCell>
                    <TableCell>Payment Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length > 0 ? (
                    <>
                      {payments
                        .filter(
                          (payment) =>
                            payment.debitedAmount && payment.debitedAmount > 0
                        )
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.id}</TableCell>
                            <TableCell>
                              {payment.debitedAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {new Date(payment.paymentDate).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {formatTransactionType(payment.transactionType)}
                            </TableCell>
                            <TableCell>{payment.paymentType}</TableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell colSpan={1} align="right">
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell colSpan={4}>
                          {payments
                            .filter(
                              (payment) =>
                                payment.debitedAmount &&
                                payment.debitedAmount > 0
                            )
                            .reduce(
                              (total, payment) => total + payment.debitedAmount,
                              0
                            )
                            .toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No debited payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Credited Details */}
          <Paper className="lines" style={{ flex: 1 }}>
            <Typography
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
                marginBottom: "10px",
                color: "#030547",
                padding: "10px",
              }}
            >
              <strong>Credited Details</strong>
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Credited Amount</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Transaction Type</TableCell>
                    <TableCell>Payment Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length > 0 ? (
                    <>
                      {payments
                        .filter(
                          (payment) =>
                            payment.creditedAmount && payment.creditedAmount > 0
                        )
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.id}</TableCell>
                            <TableCell>
                              {payment.creditedAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {new Date(payment.paymentDate).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {formatTransactionType(payment.transactionType)}
                            </TableCell>
                            <TableCell>{payment.paymentType}</TableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell colSpan={1} align="right">
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell colSpan={4}>
                          {payments
                            .filter(
                              (payment) =>
                                payment.creditedAmount &&
                                payment.creditedAmount > 0
                            )
                            .reduce(
                              (total, payment) =>
                                total + payment.creditedAmount,
                              0
                            )
                            .toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No credited payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Updated Amount */}
          <Paper className="lines" style={{ flex: 1 }}>
            <Typography
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
                marginBottom: "10px",
                color: "#030547",
                padding: "10px",
              }}
            >
              <strong>Updated Amount</strong>
            </Typography>
            <Typography
              style={{
                fontSize: "10px",
                justifyContent: "end",
                display: "flex",
              }}
            >
              <div style={{ color: "red" }}>
                <strong style={{ color: "black" }}>
                  Total On-Road Price:{" "}
                </strong>
                {total_on_road_price || "N/A"}
              </div>
            </Typography>
            <Typography
              style={{
                fontSize: "10px",
                justifyContent: "end",
                display: "flex",
              }}
            >
              <div style={{ color: "red" }}>
                <strong style={{ color: "black" }}>Total Charges: </strong>
                {total_charges || "N/A"}
              </div>
            </Typography>

            <Typography
              style={{
                fontSize: "10px",
                justifyContent: "end",
                display: "flex",
              }}
            >
              <div style={{ color: "red" }}>
                <strong style={{ color: "black" }}>Grand Total: </strong>
                {grand_total || "N/A"}
              </div>
            </Typography>

            <Typography
              style={{
                fontSize: "10px",
                justifyContent: "end",
                display: "flex",
              }}
            >
              <div style={{ color: "red" }}>
                <strong style={{ color: "black" }}>Unpaid Amount: </strong>
                {grand_total !== "N/A" && customer_account_balance !== "N/A"
                  ? grand_total - customer_account_balance
                  : 0}{" "}
              </div>
            </Typography>

            <Typography
              style={{
                paddingBottom: "10px",
                marginBottom: "10px",
                color: "#030547",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <strong>
                Customer Balance: {customer_account_balance || "N/A"}
              </strong>
              {payment_status === "Paid" ? (
                <CheckCircleOutlineRoundedIcon style={{ color: "#4CAF50" }} />
              ) : payment_status === "Unpaid" ? (
                <WatchLaterOutlinedIcon style={{ color: "#FF9800" }} />
              ) : (
                "N/A"
              )}
            </Typography>
            <Typography
              component="div"
              sx={{
                fontSize: "10px",
                display: "flex",
                gap: 1,
                justifyContent: {
                  xs: "space-between", // mobile
                  sm: "flex-end", // desktop
                },
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <strong>Invoice Date: </strong>
                {formatDate(invoice_date || "N/A")}
              </div>
              <div>
                <strong>Due Date: </strong>
                {formatDate(due_date || "N/A")}
              </div>
            </Typography>
          </Paper>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            justifyContent: "end",
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleUpdateStatus("approved")}
          >
            Approved
          </Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Rejected
          </Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setShowRefundModal(true)}
          >
            REFUND
          </Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>
      </div>

      {/* Rejected Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Typography id="rejected-modal-title">
            Rejected for: {customerId || "  "}
            <VerifiedRoundedIcon
              style={{
                color: "#092e6b",
                fontSize: "15px",
                marginTop: "-3px",
                marginRight: "-4px",
              }}
            />
          </Typography>
        </Modal.Header>

        <Modal.Body>
          <Typography>
            <strong>Full Name: </strong>
            {`${firstName || "N/A"} ${middleName || ""} ${lastName || ""}`}
          </Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Reason for cancellation (optional)"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
              marginTop: "10px",
            }}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <input
              type="checkbox"
              id="confirmCheckbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="confirmCheckbox"
              style={{ marginLeft: "5px", cursor: "pointer" }}
            >
              I confirm the cancellation
            </label>
          </div>
          {error && (
            <Typography
              style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
            >
              {error}
            </Typography>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={() => handleUpdateStatus("rejected")}
              disabled={!isConfirmed}
            >
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showRefundModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Typography variant="h6" id="rejected-modal-title">
            Refund for: {customerId || "  "}
            <VerifiedRoundedIcon
              style={{
                color: "#092e6b",
                fontSize: "15px",
                marginTop: "-3px",
                marginRight: "-4px",
              }}
            />
          </Typography>
        </Modal.Header>

        <Modal.Body>
          <Typography>
            <strong>Full Name: </strong>
            {`${firstName || "N/A"} ${middleName || ""} ${lastName || ""}`}
          </Typography>

          {/* Add Refund Amount Input */}
          <div style={{ marginTop: "10px" }}>
            <Typography variant="subtitle1">
              <strong>Refund Amount:</strong>
            </Typography>
            <input
              type="number"
              placeholder="Enter refund amount"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginTop: "5px",
              }}
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <TextareaAutosize
            minRows={3}
            placeholder="Reason for refund (optional)"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
              marginTop: "10px",
            }}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <input
              type="checkbox"
              id="confirmRefundCheckbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label
              htmlFor="confirmRefundCheckbox"
              style={{ marginLeft: "5px", cursor: "pointer" }}
            >
              I confirm the refund
            </label>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleRefundConfirmation}
              disabled={!isConfirmed}
            >
              Confirm Refund
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PaymentHistory;
