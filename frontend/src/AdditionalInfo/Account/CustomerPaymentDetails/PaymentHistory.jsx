import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  Box,
  Checkbox,
  FormControlLabel,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import axios from "axios";
import "../css/PaymentHistory.scss";
 

function PaymentHistory() {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [onRoadPriceSummary, setOnRoadPriceSummary] = useState({});
  const [chargesSummary, setChargesSummary] = useState({});
  const [invoiceSummary, setInvoiceSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [ordersprebookingdate, setOrdersprebookingdate] = useState([]);
  const [additionalInfoData, setAdditionalInfoData] = useState([]);
  const [carBookingData, setCarBookingData] = useState([]);
  const [accountmanagementrefund, setAccountmanagementrefund] = useState([]);

  // Refund Modal State
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [calculatedRefundAmount, setCalculatedRefundAmount] = useState(0);

  // Status and Rejection Modal State
  const [status, setStatus] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // State for editable fields
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [updatedOnRoadPrice, setUpdatedOnRoadPrice] = useState({
    ex_showroom_price: 0,
    accessories: 0,
    discount: 0,
    gst_rate: 0,
    cess_rate: 0,
    subtotal: 0,
    gst_amount: 0,
    cess_amount: 0,
    total_on_road_price: 0,
  });
  const [updatedCharges, setUpdatedCharges] = useState({
    coating: 0,
    fast_tag: 0,
    rto: 0,
    insurance: 0,
    extended_warranty: 0,
    auto_card: 0,
    total_charges: 0,
  });

  const [updatedInvoice, setUpdatedInvoice] = useState({
    grand_total: 0,
    customer_account_balance: 0,
  });

  const {
    invoice_date = "N/A",
    due_date = "N/A",
    payment_status = "N/A",
  } = invoiceSummary || {};

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
    prebooking = "N/A",
    prebooking_date = "N/A",
    delivery_date = "N/A",
    tentative_date = "N/A",
    preferred_date = "N/A",
    request_date = "N/A",
    order_date = "N/A",
  } = ordersprebookingdate || {};

  // Fetch customer data
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

      setCustomerData(data.customer);
      setCarBookingData(data.carbooking);
      setAdditionalInfoData(data.additionalInfo);
      setInvoiceSummary(data.invoicesummary);
      setOrdersprebookingdate(data.ordersprebookingdate);
      setAccountmanagementrefund(data.accountmanagementrefund);
      setOnRoadPriceSummary(data.onRoadPriceDetails);
      setChargesSummary(data.additionalCharges);
      setInvoiceSummary(data.invoicesummary);

      setUpdatedOnRoadPrice({
        ex_showroom_price:
          parseFloat(data.onRoadPriceDetails?.ex_showroom_price) || 0,
        accessories: parseFloat(data.onRoadPriceDetails?.accessories) || 0,
        discount: parseFloat(data.onRoadPriceDetails?.discount) || 0,
        gst_rate: parseFloat(data.onRoadPriceDetails?.gst_rate) || 0,
        cess_rate: parseFloat(data.onRoadPriceDetails?.cess_rate) || 0,
        subtotal: 0,
        gst_amount: 0,
        cess_amount: 0,
        total_on_road_price: 0,
      });
      setUpdatedCharges({
        coating: parseFloat(data.additionalCharges?.coating) || 0,
        fast_tag: parseFloat(data.additionalCharges?.fast_tag) || 0,
        rto: parseFloat(data.additionalCharges?.rto) || 0,
        insurance: parseFloat(data.additionalCharges?.insurance) || 0,
        extended_warranty:
          parseFloat(data.additionalCharges?.extended_warranty) || 0,
        auto_card: parseFloat(data.additionalCharges?.auto_card) || 0,
        total_charges: 0,
      });

      setUpdatedInvoice({
        grand_total: parseFloat(data.invoicesummary?.grand_total) || 0,
        customer_account_balance:
          parseFloat(data.invoicesummary?.customer_account_balance) || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  // Handle edit start
  const handleEditStart = (section, field, value) => {
    setEditingField(`${section}.${field}`);
    setTempValue(value);
  };

  // Handle edit save
  const handleEditSave = (section, field) => {
    if (section === "onRoad") {
      setUpdatedOnRoadPrice((prev) => ({
        ...prev,
        [field]: parseFloat(tempValue) || 0,
      }));
    } else if (section === "charges") {
      setUpdatedCharges((prev) => ({
        ...prev,
        [field]: parseFloat(tempValue) || 0,
      }));
    }
    setEditingField(null);
    setTempValue("");
  };

  // Handle Save Changes button click
  const handleSaveChangesClick = () => {
    // Calculate differences for all relevant fields
    const originalExShowroom =
      parseFloat(onRoadPriceSummary?.ex_showroom_price) || 0;
    const newExShowroom = parseFloat(updatedOnRoadPrice.ex_showroom_price) || 0;
    const exShowroomDiff = newExShowroom - originalExShowroom;

    const originalAccessories =
      parseFloat(onRoadPriceSummary?.accessories) || 0;
    const newAccessories = parseFloat(updatedOnRoadPrice.accessories) || 0;
    const accessoriesDiff = newAccessories - originalAccessories;

    const originalCoating = parseFloat(chargesSummary?.coating) || 0;
    const newCoating = parseFloat(updatedCharges.coating) || 0;
    const coatingDiff = newCoating - originalCoating;

    const originalFastTag = parseFloat(chargesSummary?.fast_tag) || 0;
    const newFastTag = parseFloat(updatedCharges.fast_tag) || 0;
    const fastTagDiff = newFastTag - originalFastTag;

    const originalRto = parseFloat(chargesSummary?.rto) || 0;
    const newRto = parseFloat(updatedCharges.rto) || 0;
    const rtoDiff = newRto - originalRto;

    const originalInsurance = parseFloat(chargesSummary?.insurance) || 0;
    const newInsurance = parseFloat(updatedCharges.insurance) || 0;
    const insuranceDiff = newInsurance - originalInsurance;

    const originalExtendedWarranty =
      parseFloat(chargesSummary?.extended_warranty) || 0;
    const newExtendedWarranty =
      parseFloat(updatedCharges.extended_warranty) || 0;
    const extendedWarrantyDiff = newExtendedWarranty - originalExtendedWarranty;

    const originalAutoCard = parseFloat(chargesSummary?.auto_card) || 0;
    const newAutoCard = parseFloat(updatedCharges.auto_card) || 0;
    const autoCardDiff = newAutoCard - originalAutoCard;

    // Calculate total refund amount
    const refundAmount =
      exShowroomDiff +
      accessoriesDiff +
      coatingDiff +
      fastTagDiff +
      rtoDiff +
      insuranceDiff +
      extendedWarrantyDiff +
      autoCardDiff;

    if (refundAmount !== 0) {
      setCalculatedRefundAmount(refundAmount);
      setRefundReason("");
      setOpenRefundModal(true);
    } else {
      updateInvoiceDetails();
    }
  };

  // Handle refund modal submit
  const handleRefundSubmit = () => {
    if (!refundReason.trim()) {
      setSnackbarMessage("Refund reason is required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Set refundStatus to "InProcess" by default
    const status = "InProcess";
    updateInvoiceDetails(refundReason, status);
    setOpenRefundModal(false);
  };

  // Update invoice details
  const updateInvoiceDetails = async (reason, status) => {
    try {
      const body = {
        exShowroomPrice: updatedOnRoadPrice.ex_showroom_price,
        accessories: updatedOnRoadPrice.accessories,
        discount: updatedOnRoadPrice.discount,
        gstRate: updatedOnRoadPrice.gst_rate,
        cessRate: updatedOnRoadPrice.cess_rate,
        coating: updatedCharges.coating,
        fastTag: updatedCharges.fast_tag,
        rto: updatedCharges.rto,
        insurance: updatedCharges.insurance,
        extendedWarranty: updatedCharges.extended_warranty,
        autoCard: updatedCharges.auto_card,
        refundReason: reason, // Pass the refund reason dynamically
        refundStatus: status, // Pass the refund status
      };
  
      const response = await fetch(
        `http://localhost:5000/api/update-invoice/customer/${customerId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update invoice');
      }
  
      await fetchCustomerData();
      setSnackbarMessage('Invoice updated successfully!');
      setSnackbarSeverity('success');
    } catch (err) {
      setSnackbarMessage('Failed to update: ' + err.message);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  

  // Format refund amount with + or -
  const formatRefundAmount = (amount) => {
    if (amount > 0) {
      return `+${formatCurrency(amount)}`; // Positive amount
    } else if (amount < 0) {
      return `${formatCurrency(amount)}`; // Negative amount
    } else {
      return formatCurrency(amount); // Zero amount
    }
  };

  // Get refund title based on amount
  const getRefundTitle = (amount) => {
    if (amount > 0) {
      return "Add On Amount"; // Positive amount
    } else if (amount < 0) {
      return "Refund Amount"; // Negative amount
    } else {
      return "No Change"; // Zero amount
    }
  };

  // Calculate derived values
  const calculateDerivedValues = (onRoadPrice) => {
    const exShowroomPrice = parseFloat(onRoadPrice?.ex_showroom_price) || 0;
    const accessories = parseFloat(onRoadPrice?.accessories) || 0;
    const discount = parseFloat(onRoadPrice?.discount) || 0;
    const gstRate = parseFloat(onRoadPrice?.gst_rate) || 0;
    const cessRate = parseFloat(onRoadPrice?.cess_rate) || 0;

    const subtotal = exShowroomPrice + accessories - discount;
    const gst_amount = subtotal * (gstRate / 100);
    const cess_amount = subtotal * (cessRate / 100);
    const total_on_road_price = subtotal + gst_amount + cess_amount;

    return { subtotal, gst_amount, cess_amount, total_on_road_price };
  };

  const { subtotal, gst_amount, cess_amount, total_on_road_price } =
    calculateDerivedValues(updatedOnRoadPrice);

  const total_charges =
    (updatedCharges.coating || 0) +
    (updatedCharges.fast_tag || 0) +
    (updatedCharges.rto || 0) +
    (updatedCharges.insurance || 0) +
    (updatedCharges.extended_warranty || 0) +
    (updatedCharges.auto_card || 0);

  const grand_total = invoiceSummary
    ? parseFloat(invoiceSummary.grand_total) || 0
    : 0;

  // Editable TableCell component
  const EditableTableCell = ({ section, field, value }) => (
    <TableCell align="right">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "flex-end",
        }}
      >
        {editingField === `${section}.${field}` ? (
          <TextField
            type="number"
            variant="standard"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => handleEditSave(section, field)}
            autoFocus
            inputProps={{ style: { textAlign: "right", width: "100px" } }}
          />
        ) : (
          <>
            <IconButton
              size="small"
              onClick={() => handleEditStart(section, field, value)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            {formatCurrency(value)}
          </>
        )}
      </div>
    </TableCell>
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div className="payment-history" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Payment History for {customerData?.firstName} {customerData?.lastName}
      </Typography>

      <div className="details-container">
        <Grid container spacing={3}>
          {/* Customer Details */}
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2 }}>
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
                        <strong>Customer Type:</strong> {customertype || "N/A"}
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
                        <strong>Birth Date:</strong>{" "}
                        {formatDate(birthDate || "N/A")}
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
                Car Details
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
                            <strong>Pre Booking:</strong> {prebooking || "N/A"}
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
                            <strong>Order Dates:</strong> {order_date || "N/A"}
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
                Additional Details
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
                      <TableCell align="right">{auto_card || "N/A"}</TableCell>
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
                      <TableCell align="right">{insurance || "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* On-Road Price Details Table */}
          <Grid item xs={12} md={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
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
                      <EditableTableCell
                        section="onRoad"
                        field="ex_showroom_price"
                        value={updatedOnRoadPrice.ex_showroom_price || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell>Accessories</TableCell>
                      <EditableTableCell
                        section="onRoad"
                        field="accessories"
                        value={updatedOnRoadPrice.accessories || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell>Discount</TableCell>
                      <EditableTableCell
                        section="onRoad"
                        field="discount"
                        value={updatedOnRoadPrice.discount || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell>Subtotal</TableCell>
                      <TableCell align="right">
                        {formatCurrency(subtotal)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        GST ({updatedOnRoadPrice.gst_rate || 0}%)
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(gst_amount)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Cess ({updatedOnRoadPrice.cess_rate || 0}%)
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(cess_amount)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Total On-Road Price
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(total_on_road_price)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Additional Charges Table */}
          <Grid item xs={12} md={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Additional Charges
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Charges</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Amount (₹)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Coating</TableCell>
                      <EditableTableCell
                        section="charges"
                        field="coating"
                        value={updatedCharges.coating || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell>FastTag</TableCell>
                      <EditableTableCell
                        section="charges"
                        field="fast_tag"
                        value={updatedCharges.fast_tag || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell>RTO</TableCell>
                      <EditableTableCell
                        section="charges"
                        field="rto"
                        value={updatedCharges.rto || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell>Insurance</TableCell>
                      <EditableTableCell
                        section="charges"
                        field="insurance"
                        value={updatedCharges.insurance || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell>Extended Warranty</TableCell>
                      <EditableTableCell
                        section="charges"
                        field="extended_warranty"
                        value={updatedCharges.extended_warranty || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell>Auto Card</TableCell>
                      <EditableTableCell
                        section="charges"
                        field="auto_card"
                        value={updatedCharges.auto_card || 0}
                      />
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Total Charges
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(total_charges)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2,  display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Refund History
              </Typography>

              <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell ><strong>Amount</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Reason</strong></TableCell>
                      <TableCell align="right"><strong>Date</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {accountmanagementrefund?.length > 0 ? (
                      accountmanagementrefund.map((refund) => (
                        <TableRow key={refund.id} hover>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color: (theme) => 
                                  refund.refundAmount < 0 
                                    ? theme.palette.error.main 
                                    : 'text.primary',
                                fontWeight: refund.refundAmount < 0 ? 500 : 'normal'
                              }}
                            >
                              {formatCurrency(refund.refundAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <span
                              style={{
                                color:
                                  refund.status === "Completed"
                                    ? "#16a34a"
                                    : refund.status === "InProcess"
                                    ? "#d97706"
                                    : "#dc2626",
                              }}
                            >
                              {refund.status}
                            </span>
                          </TableCell>
                          <TableCell sx={{ 
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  maxWidth: { xs: '120px', sm: '160px', md: '192px' }, // Responsive width
  py: 1.5 // Vertical padding
}}>
  <Typography variant="body2" sx={{ 
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.4 // Tighter line spacing
  }}>
    {refund.refundReason}
  </Typography>
</TableCell>
                          <TableCell align="right">
                            <Typography variant="caption" color="textSecondary">
                              {new Date(refund.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="textSecondary">
                            No refund history available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>

                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

       
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Updated Amount */}
        <Paper className="lines" style={{ flex: 1, padding: "10px" }}>
          <Typography
            style={{
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
              marginBottom: "10px",
              color: "#030547",
            }}
          >
            <strong>Updated Amount</strong>
          </Typography>

          {/* Total On-Road Price */}
          <Typography
            style={{
              fontSize: "10px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <strong style={{ color: "black" }}>Total On-Road Price: </strong>
            <span style={{ color: "red" }}>
              {formatCurrency(total_on_road_price) || "N/A"}
            </span>
          </Typography>

          {/* Total Charges */}
          <Typography
            style={{
              fontSize: "10px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <strong style={{ color: "black" }}>Total Charges: </strong>
            <span style={{ color: "red" }}>
              {formatCurrency(total_charges) || "N/A"}
            </span>
          </Typography>

          {/* Grand Total */}
          <Typography
            style={{
              fontSize: "10px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <strong style={{ color: "black" }}>Grand Total: </strong>
            <span style={{ color: "red" }}>
              {formatCurrency(updatedInvoice.grand_total) || "N/A"}
            </span>
          </Typography>

          {/* Unpaid Amount */}
          <Typography
            style={{
              fontSize: "10px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <strong style={{ color: "black" }}>Unpaid Amount: </strong>
            <span style={{ color: "red" }}>
              {grand_total !== "N/A" &&
              updatedInvoice.customer_account_balance !== "N/A"
                ? formatCurrency(
                    grand_total - updatedInvoice.customer_account_balance
                  )
                : formatCurrency(0)}
            </span>
          </Typography>

          {/* Customer Balance */}
          <Typography
            style={{
              paddingBottom: "10px",
              marginBottom: "10px",
              color: "#030547",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <strong>Customer Balance: </strong>
            <span>
              {formatCurrency(updatedInvoice.customer_account_balance)}
            </span>
            {payment_status === "Paid" ? (
              <CheckCircleOutlineRoundedIcon style={{ color: "#4CAF50" }} />
            ) : payment_status === "Unpaid" ? (
              <WatchLaterOutlinedIcon style={{ color: "#FF9800" }} />
            ) : (
              "N/A"
            )}
          </Typography>

          {/* Invoice and Due Date */}
          <Typography
            component="div"
            sx={{
              fontSize: "10px",
              display: "flex",
              gap: 1,
              justifyContent: { xs: "space-between" },
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

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveChangesClick}
        sx={{ mt: 3 }}
      >
        Save Changes
      </Button>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          justifyContent: "end",
        }}
      >
        {status !== "approved" && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleUpdateStatus("approved")}
          >
            Approved
          </Button>
        )}

        {status !== "rejected" && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setShowModal(true)}
          >
            Rejected
          </Button>
        )}

        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>

      {/* Refund Modal */}
      <Modal
        open={openRefundModal}
        onClose={() => setOpenRefundModal(false)}
        aria-labelledby="refund-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {getRefundTitle(calculatedRefundAmount)} {/* Dynamic title */}
          </Typography>
          <Typography gutterBottom>
            {formatRefundAmount(calculatedRefundAmount)}{" "}
            {/* Formatted amount */}
          </Typography>
          <TextField
            label={
              calculatedRefundAmount >= 0 ? "Add On Reason" : "Refund Reason"
            }
            fullWidth
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            margin="normal"
            required
          />
          <Button
            variant="contained"
            onClick={handleRefundSubmit}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="rejected-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="rejected-modal-title" variant="h6" component="h2">
            Rejected for: {customerId || "  "}
          </Typography>
          <Typography id="rejected-modal-description" sx={{ mt: 2 }}>
            <strong>Full Name: </strong>
            {`${customerData?.firstName || "N/A"} ${
              customerData?.middleName || ""
            } ${customerData?.lastName || ""}`}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Reason for cancellation (optional)"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            }
            label="I confirm the cancellation"
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setShowModal(false)} sx={{ mr: 1 }}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={() => handleUpdateStatus("rejected")}
              disabled={!isConfirmed}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PaymentHistory;
