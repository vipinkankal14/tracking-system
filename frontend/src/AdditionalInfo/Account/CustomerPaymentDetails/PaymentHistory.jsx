"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
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
  Chip,
  Tabs,
  Tab,
  Divider,
  Stack,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded"
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined"
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import ReceiptIcon from "@mui/icons-material/Receipt"
import LocalAtmIcon from "@mui/icons-material/LocalAtm"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/Cancel'
import axios from "axios"
import "../css/PaymentHistory.scss"

// Mapping function for transactionType
const formatTransactionType = (type) => {
  switch (type) {
    case "exchangeCredit":
      return "Exchange Credit"
    case "financeCredit":
      return "Finance Credit"
    case "credit":
      return "Credit"
    case "debit":
      return "Debit"
    default:
      return type
  }
}

function PaymentHistory() {
  const { customerId } = useParams()
  const [customerData, setCustomerData] = useState(null)
  const [onRoadPriceSummary, setOnRoadPriceSummary] = useState({})
  const [chargesSummary, setChargesSummary] = useState({})
  const [invoiceSummary, setInvoiceSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [ordersprebookingdate, setOrdersprebookingdate] = useState([])
  const [additionalInfoData, setAdditionalInfoData] = useState([])
  const [carBookingData, setCarBookingData] = useState([])
  const [accountmanagementrefund, setAccountmanagementrefund] = useState([])
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [accountmanagement, setAccountmanagement] = useState([])
  const [selectedStatusRefund, setSelectedStatusRefund] = useState(null)
  const [payments, setPayments] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Refund Modal State
  const [openRefundModal, setOpenRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState("")
  const [calculatedRefundAmount, setCalculatedRefundAmount] = useState(0)

  // Status and Rejection Modal State
  const [status, setStatus] = useState("")
  const [cancellationReason, setCancellationReason] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  // State for editable fields
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState("")
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
  })
  const [updatedCharges, setUpdatedCharges] = useState({
    coating: 0,
    fast_tag: 0,
    rto: 0,
    insurance: 0,
    extended_warranty: 0,
    auto_card: 0,
    total_charges: 0,
  })
  const [updatedInvoice, setUpdatedInvoice] = useState({
    grand_total: 0,
    customer_account_balance: 0,
  })

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const { invoice_date = "N/A", due_date = "N/A", payment_status = "N/A" } = invoiceSummary || {}

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
    aadhaarNumber = "N/A",
    panNumber = "N/A",
  } = customerData || {}

  const {
    model = "N/A",
    version = "N/A",
    color = "N/A",
    team_Member = "N/A",
    team_Leader = "N/A",
  } = carBookingData || {}

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
  } = additionalInfoData || {}

  const {
    prebooking = "N/A",
    prebooking_date = "N/A",
    delivery_date = "N/A",
    tentative_date = "N/A",
    preferred_date = "N/A",
    request_date = "N/A",
    order_date = "N/A",
  } = ordersprebookingdate || {}

  // Fetch customer data
  const fetchCustomerData = async () => {
    if (!customerId) {
      setError("Customer ID is undefined.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/PaymentHistory/${customerId}`)
      if (!response.ok) {
        throw new Error(`Error fetching customer data: ${response.status}`)
      }
      const data = await response.json()

      setCustomerData(data.customer)
      setCarBookingData(data.carbooking)
      setAdditionalInfoData(data.additionalInfo)
      setInvoiceSummary(data.invoicesummary)
      setAccountmanagement(data.accountmanagement)
      setOrdersprebookingdate(data.ordersprebookingdate)
      setAccountmanagementrefund(data.accountmanagementrefund)
      setOnRoadPriceSummary(data.onRoadPriceDetails)
      setChargesSummary(data.additionalCharges)
      setInvoiceSummary(data.invoicesummary)

      setUpdatedOnRoadPrice({
        ex_showroom_price: Number.parseFloat(data.onRoadPriceDetails?.ex_showroom_price) || 0,
        accessories: Number.parseFloat(data.onRoadPriceDetails?.accessories) || 0,
        discount: Number.parseFloat(data.onRoadPriceDetails?.discount) || 0,
        gst_rate: Number.parseFloat(data.onRoadPriceDetails?.gst_rate) || 0,
        cess_rate: Number.parseFloat(data.onRoadPriceDetails?.cess_rate) || 0,
        subtotal: 0,
        gst_amount: 0,
        cess_amount: 0,
        total_on_road_price: 0,
      })
      setUpdatedCharges({
        coating: Number.parseFloat(data.additionalCharges?.coating) || 0,
        fast_tag: Number.parseFloat(data.additionalCharges?.fast_tag) || 0,
        rto: Number.parseFloat(data.additionalCharges?.rto) || 0,
        insurance: Number.parseFloat(data.additionalCharges?.insurance) || 0,
        extended_warranty: Number.parseFloat(data.additionalCharges?.extended_warranty) || 0,
        auto_card: Number.parseFloat(data.additionalCharges?.auto_card) || 0,
        total_charges: 0,
      })

      setUpdatedInvoice({
        grand_total: Number.parseFloat(data.invoicesummary?.grand_total) || 0,
        customer_account_balance: Number.parseFloat(data.invoicesummary?.customer_account_balance) || 0,
      })

      setPayments(
        data.cashier.map((item) => ({
          id: item.id,
          debitedAmount: Number(item.debitedAmount) || 0,
          creditedAmount: Number(item.creditedAmount) || 0,
          paymentDate: item.paymentDate,
          transactionType: item.transactionType,
          paymentType: item.paymentType,
        })),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomerData()
  }, [customerId])

  const handleUpdateStatus = async (status) => {
    try {
      const payload = {
        status,
        cancellationReason: status === "Rejected" ? cancellationReason : null,
      }

      const response = await axios.put(`http://localhost:5000/api/account/update-status/${customerId}`, payload)

      if (response.status === 200) {
        setSnackbarMessage(`Status updated to ${status} successfully!`)
        setSnackbarSeverity("success")
        setSnackbarOpen(true)

        if (status === "Rejected") {
          setShowModal(false)
          setCancellationReason("")
        }
        fetchCustomerData()
      }
    } catch (err) {
      console.error("Error updating status:", err)
      setSnackbarMessage(`Failed to update status: ${err.message}`)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  // Handle edit start
  const handleEditStart = (section, field, value) => {
    setEditingField(`${section}.${field}`)
    setTempValue(value)
  }

  // Handle edit save
  const handleEditSave = (section, field) => {
    if (section === "onRoad") {
      setUpdatedOnRoadPrice((prev) => ({
        ...prev,
        [field]: Number.parseFloat(tempValue) || 0,
      }))
    } else if (section === "charges") {
      setUpdatedCharges((prev) => ({
        ...prev,
        [field]: Number.parseFloat(tempValue) || 0,
      }))
    }
    setEditingField(null)
    setTempValue("")
  }

  // Handle Save Changes button click
  const handleSaveChangesClick = () => {
    // Calculate differences for all relevant fields
    const originalExShowroom = Number.parseFloat(onRoadPriceSummary?.ex_showroom_price) || 0
    const newExShowroom = Number.parseFloat(updatedOnRoadPrice.ex_showroom_price) || 0
    const exShowroomDiff = newExShowroom - originalExShowroom

    const originalAccessories = Number.parseFloat(onRoadPriceSummary?.accessories) || 0
    const newAccessories = Number.parseFloat(updatedOnRoadPrice.accessories) || 0
    const accessoriesDiff = newAccessories - originalAccessories

    const originalCoating = Number.parseFloat(chargesSummary?.coating) || 0
    const newCoating = Number.parseFloat(updatedCharges.coating) || 0
    const coatingDiff = newCoating - originalCoating

    const originalFastTag = Number.parseFloat(chargesSummary?.fast_tag) || 0
    const newFastTag = Number.parseFloat(updatedCharges.fast_tag) || 0
    const fastTagDiff = newFastTag - originalFastTag

    const originalRto = Number.parseFloat(chargesSummary?.rto) || 0
    const newRto = Number.parseFloat(updatedCharges.rto) || 0
    const rtoDiff = newRto - originalRto

    const originalInsurance = Number.parseFloat(chargesSummary?.insurance) || 0
    const newInsurance = Number.parseFloat(updatedCharges.insurance) || 0
    const insuranceDiff = newInsurance - originalInsurance

    const originalExtendedWarranty = Number.parseFloat(chargesSummary?.extended_warranty) || 0
    const newExtendedWarranty = Number.parseFloat(updatedCharges.extended_warranty) || 0
    const extendedWarrantyDiff = newExtendedWarranty - originalExtendedWarranty

    const originalAutoCard = Number.parseFloat(chargesSummary?.auto_card) || 0
    const newAutoCard = Number.parseFloat(updatedCharges.auto_card) || 0
    const autoCardDiff = newAutoCard - originalAutoCard

    // Calculate total refund amount
    const refundAmount =
      exShowroomDiff +
      accessoriesDiff +
      coatingDiff +
      fastTagDiff +
      rtoDiff +
      insuranceDiff +
      extendedWarrantyDiff +
      autoCardDiff

    if (refundAmount !== 0) {
      setCalculatedRefundAmount(refundAmount)
      setRefundReason("")
      setOpenRefundModal(true)
    } else {
      updateInvoiceDetails()
    }
  }

  // Handle refund modal submit
  const handleRefundSubmit = () => {
    if (!refundReason.trim()) {
      setSnackbarMessage("Refund reason is required")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      return
    }

    // Set refundStatus to "InProcess" by default
    const status = "InProcess"
    updateInvoiceDetails(refundReason, status)
    setOpenRefundModal(false)
  }

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
        refundReason: reason,
        refundStatus: status,
      }

      const response = await fetch(`http://localhost:5000/api/update-invoice/customer/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update invoice")
      }

      await fetchCustomerData()
      setSnackbarMessage("Invoice updated successfully!")
      setSnackbarSeverity("success")
    } catch (err) {
      setSnackbarMessage("Failed to update: " + err.message)
      setSnackbarSeverity("error")
    } finally {
      setSnackbarOpen(true)
    }
  }

  // Calculate derived values
  const calculateDerivedValues = (onRoadPrice) => {
    const exShowroomPrice = Number.parseFloat(onRoadPrice?.ex_showroom_price) || 0
    const accessories = Number.parseFloat(onRoadPrice?.accessories) || 0
    const discount = Number.parseFloat(onRoadPrice?.discount) || 0
    const gstRate = Number.parseFloat(onRoadPrice?.gst_rate) || 0
    const cessRate = Number.parseFloat(onRoadPrice?.cess_rate) || 0

    const subtotal = exShowroomPrice + accessories - discount
    const gst_amount = subtotal * (gstRate / 100)
    const cess_amount = subtotal * (cessRate / 100)
    const total_on_road_price = subtotal + gst_amount + cess_amount

    return { subtotal, gst_amount, cess_amount, total_on_road_price }
  }

  const { subtotal, gst_amount, cess_amount, total_on_road_price } = calculateDerivedValues(updatedOnRoadPrice)

  const total_charges =
    (updatedCharges.coating || 0) +
    (updatedCharges.fast_tag || 0) +
    (updatedCharges.rto || 0) +
    (updatedCharges.insurance || 0) +
    (updatedCharges.extended_warranty || 0) +
    (updatedCharges.auto_card || 0)

  const grand_total = invoiceSummary ? Number.parseFloat(invoiceSummary.grand_total) || 0 : 0

  const customer_account_balance = invoiceSummary ? Number.parseFloat(invoiceSummary.customer_account_balance) || 0 : 0

  const unpaid_amount = grand_total - customer_account_balance

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
            {payment_status !== "Unpaid" && (
              <IconButton size="small" onClick={() => handleEditStart(section, field, value)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {formatCurrency(value)}
          </>
        )}
      </div>
    </TableCell>
  )

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A"

    try {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" }
      return new Date(dateString).toLocaleDateString("en-US", options)
    } catch (e) {
      return "Invalid Date"
    }
  }

  // Filter logic for refunds (negative amounts)
  const filteredRefunds =
    accountmanagementrefund?.filter((refund) => {
      const amount = Number.parseFloat(refund.refundAmount) || 0
      const statusMatch = !selectedStatusRefund || refund.status === selectedStatusRefund
      return amount < 0 && statusMatch
    }) || []

  // Status counts calculation for refunds
  const statusCountsRefund = {
    All: filteredRefunds.length,
    Completed: filteredRefunds.filter((refund) => refund.status === "Completed").length,
    InProcess: filteredRefunds.filter((refund) => refund.status === "InProcess").length,
    Failed: filteredRefunds.filter((refund) => refund.status === "Failed").length,
  }

  // Filter logic for add-ons (positive amounts)
  const filteredAddOns =
    accountmanagementrefund?.filter((refund) => {
      const amount = Number.parseFloat(refund.refundAmount) || 0
      const statusMatch = !selectedStatus || refund.status === selectedStatus
      return amount > 0 && statusMatch
    }) || []

  // Status counts calculation for add-ons
  const statusCountsAddOns = {
    All: filteredAddOns.length,
    Completed: filteredAddOns.filter(
      (refund) => refund.status === "Completed" && Number.parseFloat(refund.refundAmount) > 0,
    ).length,
    InProcess: filteredAddOns.filter(
      (refund) => refund.status === "InProcess" && Number.parseFloat(refund.refundAmount) > 0,
    ).length,
    Failed: filteredAddOns.filter((refund) => refund.status === "Failed" && Number.parseFloat(refund.refundAmount) > 0)
      .length,
  }

  // Format refund amount with + or -
  const formatRefundAmount = (amount) => {
    if (amount > 0) {
      return `+${formatCurrency(amount)}` // Positive amount
    } else if (amount < 0) {
      return `${formatCurrency(amount)}` // Negative amount
    } else {
      return formatCurrency(amount) // Zero amount
    }
  }

  // Get refund title based on amount
  const getRefundTitle = (amount) => {
    if (amount > 0) {
      return "Add On Amount" // Positive amount
    } else if (amount < 0) {
      return "Refund Amount" // Negative amount
    } else {
      return "No Change" // Zero amount
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount))
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert severity="error">{error}</Alert>
      </div>
    )
  }

  return (
    <div className="payment-history" style={{ padding: isMobile ? "10px" : "20px" }}>
      {/* Header with back button and status */}
      <Paper elevation={1} style={{ padding: "15px", marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IconButton color="primary" onClick={() => window.history.back()}>
              <ArrowBackIcon />
            </IconButton>
            <div>
              <Typography variant="h6" style={{ marginBottom: "4px" }}>
                Payment History for <span style={{ color: "#d32f2f" }}>{`${firstName || ""} ${lastName || ""}`}</span>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Customer Type: {customertype ? customertype.charAt(0).toUpperCase() + customertype.slice(1) : "N/A"}
              </Typography>
            </div>
          </div>

          {accountmanagement?.status && (
            <div>
              <Chip
                label={accountmanagement.status}
                color={
                  accountmanagement.status === "Approval"
                    ? "success"
                    : accountmanagement.status === "Rejected"
                      ? "error"
                      : "warning"
                }
                style={{ fontWeight: "bold" }}
              />
              {accountmanagement.status === "Rejected" && accountmanagement.cancellationReason && (
                <Typography variant="caption" color="error" style={{ display: "block", marginTop: "4px" }}>
                  Reason: {accountmanagement.cancellationReason}
                </Typography>
              )}
            </div>
          )}
        </div>
      </Paper>

      {/* Customer and Car Details */}
      <Grid container spacing={isMobile ? 2 : 3} style={{ marginBottom: "20px" }}>
        {/* Customer Details */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} style={{ height: "100%" }}>
            <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
              <Typography variant="h6" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Customer Details
              </Typography>
            </div>
            <TableContainer style={{ padding: "10px" }}>
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
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Full Name:</strong> {`${firstName || "N/A"} ${middleName || ""} ${lastName || ""}`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Birth Date:</strong> {formatDate(birthDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Email:</strong> {email || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Phone:</strong> {mobileNumber1 || "N/A"}
                      {mobileNumber2 ? `, ${mobileNumber2}` : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
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
                      <strong>Location:</strong> {`${city || "N/A"}, ${state || "N/A"}, ${country || "N/A"}`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Aadhaar:</strong> {aadhaarNumber || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>PAN:</strong> {panNumber || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Car Details */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} style={{ height: "100%" }}>
            <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
              <Typography variant="h6" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                Car Details
              </Typography>
            </div>
            <TableContainer style={{ padding: "10px" }}>
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
                          <strong>Prebooking date:</strong> {formatDate(prebooking_date)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Delivery date:</strong> {formatDate(delivery_date)}
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
                          <strong>Tentative Date:</strong> {formatDate(tentative_date)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Preferred Date:</strong> {formatDate(preferred_date)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Request Date:</strong> {formatDate(request_date)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Additional Details */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} style={{ height: "100%" }}>
            <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
              <Typography variant="h6" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ReceiptIcon style={{ width: "20px", height: "20px" }} />
                Additional Details
              </Typography>
            </div>
            <TableContainer style={{ padding: "10px" }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Extended Warranty:</strong>
                    </TableCell>
                    <TableCell align="right">{extended_warranty || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Exchange:</strong>
                    </TableCell>
                    <TableCell align="right">{exchange || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Finance:</strong>
                    </TableCell>
                    <TableCell align="right">{finance || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Accessories:</strong>
                    </TableCell>
                    <TableCell align="right">{accessories || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Coating:</strong>
                    </TableCell>
                    <TableCell align="right">{coating || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Auto Card:</strong>
                    </TableCell>
                    <TableCell align="right">{auto_card || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>RTO Tax:</strong>
                    </TableCell>
                    <TableCell align="right">{rto || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Fast Tag:</strong>
                    </TableCell>
                    <TableCell align="right">{fast_tag || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Insurance:</strong>
                    </TableCell>
                    <TableCell align="right">{insurance || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Price Details */}
      <Grid container spacing={isMobile ? 2 : 3} style={{ marginBottom: "20px" }}>
        {/* On-Road Price Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2}>
            <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
              <Typography variant="h6">On-Road Price Details</Typography>
            </div>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
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
                    <EditableTableCell section="onRoad" field="discount" value={updatedOnRoadPrice.discount || 0} />
                  </TableRow>
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell align="right">{formatCurrency(subtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GST ({updatedOnRoadPrice.gst_rate || 0}%)</TableCell>
                    <TableCell align="right">{formatCurrency(gst_amount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cess ({updatedOnRoadPrice.cess_rate || 0}%)</TableCell>
                    <TableCell align="right">{formatCurrency(cess_amount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Total On-Road Price</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      {formatCurrency(total_on_road_price)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Additional Charges */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2}>
            <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
              <Typography variant="h6">Additional Charges</Typography>
            </div>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Charges</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Amount (₹)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Coating</TableCell>
                    <EditableTableCell section="charges" field="coating" value={updatedCharges.coating || 0} />
                  </TableRow>
                  <TableRow>
                    <TableCell>FastTag</TableCell>
                    <EditableTableCell section="charges" field="fast_tag" value={updatedCharges.fast_tag || 0} />
                  </TableRow>
                  <TableRow>
                    <TableCell>RTO</TableCell>
                    <EditableTableCell section="charges" field="rto" value={updatedCharges.rto || 0} />
                  </TableRow>
                  <TableRow>
                    <TableCell>Insurance</TableCell>
                    <EditableTableCell section="charges" field="insurance" value={updatedCharges.insurance || 0} />
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
                    <EditableTableCell section="charges" field="auto_card" value={updatedCharges.auto_card || 0} />
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Total Charges</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      {formatCurrency(total_charges)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Save Changes Button */}
        <Grid item xs={12}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSaveChangesClick}>
              Save Changes
            </Button>
          </div>
        </Grid>
      </Grid>

      {/* Payment History Tabs */}
      <Paper elevation={2} style={{ marginBottom: "20px" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant={isMobile ? "fullWidth" : "standard"}
          centered
        >
          <Tab label="Payment Details" icon={<LocalAtmIcon />} iconPosition="start" />
          <Tab label="Refund History" icon={<RemoveCircleOutlineIcon />} iconPosition="start" />
          <Tab label="Add-On History" icon={<AddCircleOutlineIcon />} iconPosition="start" />
        </Tabs>

        {/* Payment Details Tab */}
        {activeTab === 0 && (
          <div style={{ padding: "20px" }}>
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Credited Amount</TableCell>
                    <TableCell>Payment Date</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>Transaction Type</TableCell>
                        <TableCell>Payment Type</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length > 0 ? (
                    payments
                      .filter((payment) => payment.creditedAmount && payment.creditedAmount > 0)
                      .map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.id}</TableCell>
                          <TableCell style={{ color: "#4caf50" }}>{formatCurrency(payment.creditedAmount)}</TableCell>
                          <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                          {!isMobile && (
                            <>
                              <TableCell>{formatTransactionType(payment.transactionType)}</TableCell>
                              <TableCell>{payment.paymentType}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 3 : 5} align="center">
                        No credited payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "15px",
                borderTop: "1px solid #eee",
                marginTop: "10px",
              }}
            >
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                <span>Total:</span>{" "}
                <span style={{ color: "#4caf50" }}>
                  {formatCurrency(
                    payments
                      .filter((payment) => payment.creditedAmount && payment.creditedAmount > 0)
                      .reduce((total, payment) => total + payment.creditedAmount, 0),
                  )}
                </span>
              </Typography>
            </div>
          </div>
        )}

        {/* Refund History Tab */}
        {activeTab === 1 && (
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px", flexWrap: "wrap" }}>
              {["All", "Completed", "InProcess", "Failed"].map((status) => (
                <Chip
                  key={status}
                  label={`${status} (${statusCountsRefund[status] || 0})`}
                  onClick={() => setSelectedStatusRefund(status === "All" ? null : status)}
                  color={selectedStatusRefund === status ? "primary" : "default"}
                  variant={selectedStatusRefund === status ? "filled" : "outlined"}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedStatusRefund === status
                        ? status === "Completed"
                          ? "#4caf50"
                          : status === "InProcess"
                            ? "#ff9800"
                            : status === "Failed"
                              ? "#f44336"
                              : "#3f51b5"
                        : "transparent",
                    color: selectedStatusRefund === status ? "#fff" : "inherit",
                  }}
                />
              ))}
            </div>

            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRefunds.length > 0 ? (
                    filteredRefunds.map((refund) => (
                      <TableRow key={refund.id} hover>
                        <TableCell style={{ color: "#f44336", fontWeight: 500 }}>
                          {formatCurrency(refund.refundAmount)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={refund.status}
                            size="small"
                            style={{
                              backgroundColor:
                                refund.status === "Completed"
                                  ? "#e8f5e9"
                                  : refund.status === "InProcess"
                                    ? "#fff8e1"
                                    : "#ffebee",
                              color:
                                refund.status === "Completed"
                                  ? "#2e7d32"
                                  : refund.status === "InProcess"
                                    ? "#f57c00"
                                    : "#c62828",
                            }}
                          />
                        </TableCell>
                        <TableCell style={{ maxWidth: "200px", whiteSpace: "normal", wordWrap: "break-word" }}>
                          {refund.refundReason}
                        </TableCell>
                        <TableCell align="right">{formatDate(refund.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" style={{ padding: "20px" }}>
                        <Typography color="textSecondary">No refund history available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "15px",
                borderTop: "1px solid #eee",
                marginTop: "10px",
              }}
            >
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                <span>Total Refunds:</span>{" "}
                <span style={{ color: "#f44336" }}>
                  {formatCurrency(filteredRefunds.reduce((sum, refund) => sum + Number(refund.refundAmount), 0) || 0)}
                </span>
              </Typography>
            </div>
          </div>
        )}

        {/* Add-On History Tab */}
        {activeTab === 2 && (
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px", flexWrap: "wrap" }}>
              {["All", "Completed", "InProcess", "Failed"].map((status) => (
                <Chip
                  key={status}
                  label={`${status} (${statusCountsAddOns[status] || 0})`}
                  onClick={() => setSelectedStatus(status === "All" ? null : status)}
                  color={selectedStatus === status ? "primary" : "default"}
                  variant={selectedStatus === status ? "filled" : "outlined"}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedStatus === status
                        ? status === "Completed"
                          ? "#4caf50"
                          : status === "InProcess"
                            ? "#ff9800"
                            : status === "Failed"
                              ? "#f44336"
                              : "#3f51b5"
                        : "transparent",
                    color: selectedStatus === status ? "#fff" : "inherit",
                  }}
                />
              ))}
            </div>

            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAddOns.length > 0 ? (
                    filteredAddOns.map((addon) => {
                      const amount = Math.abs(Number.parseFloat(addon.refundAmount)) || 0
                      return (
                        <TableRow key={addon.id} hover>
                          <TableCell style={{ color: "#4caf50", fontWeight: 500 }}>+{formatCurrency(amount)}</TableCell>
                          <TableCell>
                            <Chip
                              label={addon.status}
                              size="small"
                              style={{
                                backgroundColor:
                                  addon.status === "Completed"
                                    ? "#e8f5e9"
                                    : addon.status === "InProcess"
                                      ? "#fff8e1"
                                      : "#ffebee",
                                color:
                                  addon.status === "Completed"
                                    ? "#2e7d32"
                                    : addon.status === "InProcess"
                                      ? "#f57c00"
                                      : "#c62828",
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ maxWidth: "200px", whiteSpace: "normal", wordWrap: "break-word" }}>
                            {addon.refundReason}
                          </TableCell>
                          <TableCell align="right">{formatDate(addon.createdAt)}</TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" style={{ padding: "20px" }}>
                        <Typography color="textSecondary">No add-on history available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "15px",
                borderTop: "1px solid #eee",
                marginTop: "10px",
              }}
            >
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                <span>Total Add-Ons:</span>{" "}
                <span style={{ color: "#4caf50" }}>
                  +
                  {formatCurrency(
                    Math.abs(filteredAddOns.reduce((sum, addon) => sum + Number(addon.refundAmount), 0) || 0),
                  )}
                </span>
              </Typography>
            </div>
          </div>
        )}
      </Paper>

      {/* Invoice Summary */}
      <Grid container spacing={isMobile ? 2 : 3} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2}>
            <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
              <Typography variant="h6">Invoice Summary</Typography>
            </div>
            <div style={{ padding: "15px" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <strong>Total On-Road Price:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <strong>Total Charges:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <strong>Total Refunds:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <strong>Total Add-On:</strong>
                  </Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <strong>Grand Total:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <strong>Paid Amount:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <strong>Unpaid Amount:</strong>
                  </Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <strong>Payment Status:</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "right" }}>
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    {formatCurrency(total_on_road_price)}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    {formatCurrency(total_charges)}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px", color: "#f44336" }}>
                    {formatCurrency(filteredRefunds.reduce((sum, refund) => sum + Number(refund.refundAmount), 0) || 0)}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px", color: "#4caf50" }}>
                    +
                    {formatCurrency(
                      Math.abs(filteredAddOns.reduce((sum, addon) => sum + Number(addon.refundAmount), 0) || 0),
                    )}
                  </Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2" style={{ marginBottom: "8px", fontWeight: "bold" }}>
                    {formatCurrency(grand_total)}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px", color: "#4caf50", fontWeight: "bold" }}>
                    {formatCurrency(customer_account_balance)}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "8px", color: "#f44336", fontWeight: "bold" }}>
                    {formatCurrency(unpaid_amount)}
                  </Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2" style={{ marginBottom: "8px" }}>
                    <Chip
                      label={payment_status}
                      size="small"
                      color={payment_status === "Paid" ? "success" : "error"}
                      icon={payment_status === "Paid" ? <CheckCircleOutlineRoundedIcon /> : <WatchLaterOutlinedIcon />}
                    />
                  </Typography>
                </Grid>
              </Grid>
              <div style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Invoice Date: {formatDate(invoice_date)}</span>
                  <span>Due Date: {formatDate(due_date)}</span>
                </div>
              </div>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ border: 1, borderColor: 'divider' }}>
            {/* Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}>
              <Typography variant="h6" component="div">
                Actions
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2 }}>
              {invoiceSummary?.payment_status === "Paid" && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Update payment approval status for this customer
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {accountmanagement?.status !== "Approval" && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdateStatus("Approval")}
                        startIcon={<CheckCircleOutlineIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        Approve Payment
                      </Button>
                    )}

                    {accountmanagement?.status !== "Rejected" && (
                      <Button 
                        variant="contained" 
                        color="error"
                        onClick={() => setShowModal(true)}
                        startIcon={<CancelIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        Reject Payment
                      </Button>
                    )}
                  </Stack>
                </>
              )}

              {/* Always show back button */}
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => window.history.back()} 
                  startIcon={<ArrowBackIcon />}
                  fullWidth
                  sx={{ textTransform: 'none' }}
                >
                  Back to List
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Rejection Modal */}
          <Modal open={showModal} onClose={() => setShowModal(false)} aria-labelledby="rejected-modal-title">
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isMobile ? "90%" : 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: "4px",
              }}
            >
              <Typography id="rejected-modal-title" variant="h6" component="h2">
                Reject Customer: {customerId || ""}
              </Typography>
              <Typography id="rejected-modal-description" style={{ marginTop: "10px", marginBottom: "15px" }}>
                <strong>Full Name: </strong>
                {`${customerData?.firstName || "N/A"} ${customerData?.middleName || ""} ${customerData?.lastName || ""}`}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Reason for cancellation (required)"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                margin="normal"
              />
              <FormControlLabel
                control={<Checkbox checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} />}
                label="I confirm the cancellation"
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <Button onClick={() => setShowModal(false)} style={{ marginRight: "10px" }}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateStatus("Rejected")}
                  disabled={!isConfirmed || !cancellationReason.trim()}
                >
                  Confirm
                </Button>
              </div>
            </Box>
          </Modal>
        </Grid>
      </Grid>

      {/* Refund Modal */}
      <Modal open={openRefundModal} onClose={() => setOpenRefundModal(false)} aria-labelledby="refund-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "4px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {getRefundTitle(calculatedRefundAmount)}
          </Typography>
          <Typography
            gutterBottom
            style={{
              color: calculatedRefundAmount > 0 ? "#4caf50" : "#f44336",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {formatRefundAmount(calculatedRefundAmount)}
          </Typography>
          <TextField
            label={calculatedRefundAmount >= 0 ? "Add On Reason" : "Refund Reason"}
            fullWidth
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            margin="normal"
            required
            multiline
            rows={3}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button variant="outlined" onClick={() => setOpenRefundModal(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleRefundSubmit} disabled={!refundReason.trim()}>
              Submit
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} style={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default PaymentHistory