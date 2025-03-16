"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
  Collapse,
  List,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  FormControl,
} from "@mui/material";
import { SearchIcon, ChevronDown, ChevronUp } from "lucide-react";

const PaymentRefundAddOn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Fetch customers with refund data
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getAllAccountManagementRefund"
      );
      setCustomers(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch refund data");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle row expansion
  const toggleRow = (customerId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };

  // Calculate total refund amount for a customer (only positive amounts)
  const calculateTotalRefundAmount = (customer) => {
    if (!customer.accountmanagementrefundRequests) return 0;
    return customer.accountmanagementrefundRequests.reduce((total, refund) => {
      const amount = Number.parseFloat(refund.refundAmount) || 0;
      return amount > 0 ? total + amount : total;
    }, 0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Process refund modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [processStatus, setProcessStatus] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [reason, setReason] = useState("");
  const [processError, setProcessError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Open modal for processing refund
  const handleProcessClick = (refund) => {
    setSelectedRefund(refund);
    setModalOpen(true);
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setModalOpen(false);
    setProcessStatus("");
    setTransactionType("");
    setReason("");
    setSelectedRefund(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setProcessError("");
    setSubmitting(true);

    try {
      // Validate form inputs
      if (processStatus === "Completed" && !transactionType) {
        throw new Error("Transaction type is required for completed refunds");
      }
      if (processStatus === "Failed" && !reason) {
        throw new Error("Reason is required for failed refunds");
      }

      // Prepare API payload
      const payload = {
        status: processStatus,
        transactionType: processStatus === "Completed" ? transactionType : null,
        refundReason: processStatus === "Failed" ? reason : null,
        id: selectedRefund.id,
      };

      // Send update request to backend
      await axios.put("http://localhost:5000/api/updateRefund", payload);

      // Refresh customer data
      await fetchCustomers();
      handleCloseModal();
    } catch (err) {
      setProcessError(
        err.response?.data?.message || err.message || "Failed to process refund"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ProcessModal component
  const ProcessModal = () => (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
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
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Process Refund
        </Typography>

        {/* Error message display */}
        {processError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {processError}
          </Typography>
        )}

        {/* Status selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={processStatus}
            onChange={(e) => setProcessStatus(e.target.value)}
            label="Status"
            disabled={submitting}
          >
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
          </Select>
        </FormControl>

        {/* Transaction type (only for Completed status) */}
        {processStatus === "Completed" && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Transaction Type</InputLabel>
            <Select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              label="Transaction Type"
              disabled={submitting}
            >
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Reason input (only for Failed status) */}
        {processStatus === "Failed" && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mb: 2 }}
            disabled={submitting}
          />
        )}

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  // Mobile view for customer cards
  const MobileCustomerCard = ({ customer }) => {
    const isExpanded = expandedRows[customer.customerId];
    const totalRefund = calculateTotalRefundAmount(customer);

    // Filter refunds with positive amounts
    const positiveRefunds = customer.accountmanagementrefundRequests?.filter(
      (refund) => Number.parseFloat(refund.refundAmount) > 0
    );

    if (totalRefund === 0) return null;

    return (
      <Card
        sx={{
          mb: 2,
          borderLeft: totalRefund > 0 ? "4px solid #ff9800" : "none",
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {`${customer.firstName} ${customer.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {customer.customerId}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                +{formatCurrency(totalRefund)}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" sx={{ mt: 1 }}>
            {customer.email}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Car: {customer.carBooking?.model || "N/A"}
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => toggleRow(customer.customerId)}
              variant="text"
              size="small"
              endIcon={
                isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              }
            >
              Refund History
            </Button>
            <Chip
              label={`${positiveRefunds?.length || 0} Refunds`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Refund Details
            </Typography>

            {positiveRefunds?.length > 0 ? (
              <List disablePadding>
                {positiveRefunds.map((refund) => (
                  <Card key={refund.id} variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Refund ID:
                        </Typography>
                        <Typography variant="body2">{refund.id}</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        <Typography variant="caption" color="text.secondary">
                          Amount:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: (theme) => theme.palette.success.main,
                            fontWeight: 500,
                          }}
                        >
                          +{formatCurrency(refund.refundAmount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Status:
                        </Typography>
                        <Chip
                          label={refund.status}
                          size="small"
                          color={getStatusColor(refund.status)}
                          sx={{ height: "20px", fontSize: "0.7rem" }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Reason:
                        </Typography>
                        <Typography variant="body2">
                          {refund.refundReason || "N/A"}
                        </Typography>
                      </Grid>
                      {/* Add Process Button */}
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          onClick={() => handleProcessClick(refund)}
                          variant="outlined"
                          size="small"
                        >
                          Process
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                No refund history available
              </Typography>
            )}
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  // Tablet view with simplified table
  const TabletView = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Car</TableCell>
            <TableCell>Refund Total Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => {
            const totalRefundAmount = calculateTotalRefundAmount(customer);
            if (totalRefundAmount === 0) return null;

            const positiveRefunds =
              customer.accountmanagementrefundRequests?.filter(
                (refund) => Number.parseFloat(refund.refundAmount) > 0
              );
            return (
              <React.Fragment key={customer.customerId}>
                <TableRow
                  sx={{
                    backgroundColor: expandedRows[customer.customerId]
                      ? "rgba(0, 0, 0, 0.04)"
                      : "inherit",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {`${customer.firstName} ${customer.lastName}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.customerId}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {customer.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{customer.carBooking?.model || "N/A"}</TableCell>
                  <TableCell
                    sx={{
                      color: (theme) => theme.palette.success.main,
                      fontWeight: 500,
                    }}
                  >
                    +{formatCurrency(totalRefundAmount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => toggleRow(customer.customerId)}
                      variant={
                        expandedRows[customer.customerId]
                          ? "contained"
                          : "outlined"
                      }
                      size="small"
                      color={
                        expandedRows[customer.customerId]
                          ? "primary"
                          : "inherit"
                      }
                      endIcon={
                        expandedRows[customer.customerId] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      }
                    >
                      {expandedRows[customer.customerId]
                        ? "Hide"
                        : `View (${positiveRefunds?.length || 0})`}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows[customer.customerId] && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0, borderBottom: "none" }}>
                      <Box sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 2, fontWeight: "bold" }}
                        >
                          Refund History for {customer.customerId}
                        </Typography>
                        {positiveRefunds?.length > 0 ? (
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Refund ID</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell>Reason</TableCell>
                                  <TableCell>Amount</TableCell>
                                  <TableCell>Payment Process</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {positiveRefunds.map((refund) => (
                                  <TableRow key={refund.id}>
                                    <TableCell>{refund.id}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={refund.status}
                                        size="small"
                                        color={getStatusColor(refund.status)}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {refund.refundReason || "N/A"}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        color: (theme) =>
                                          theme.palette.success.main,
                                        fontWeight: 500,
                                      }}
                                    >
                                      +{formatCurrency(refund.refundAmount)}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        onClick={() =>
                                          handleProcessClick(refund)
                                        }
                                        variant="outlined"
                                        size="small"
                                      >
                                        Process
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No refund history available for this customer
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Desktop view with full table
  const DesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer ID</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Car Details</TableCell>
            <TableCell>Refund Total Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => {
            const totalRefundAmount = calculateTotalRefundAmount(customer);
            if (totalRefundAmount === 0) return null;

            const positiveRefunds =
              customer.accountmanagementrefundRequests?.filter(
                (refund) => Number.parseFloat(refund.refundAmount) > 0
              );
            return (
              <React.Fragment key={customer.customerId}>
                <TableRow
                  sx={{
                    backgroundColor: expandedRows[customer.customerId]
                      ? "rgba(0, 0, 0, 0.04)"
                      : "inherit",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                  }}
                >
                  <TableCell>{customer.customerId}</TableCell>
                  <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.carBooking?.model || "N/A"}</TableCell>
                  <TableCell
                    sx={{
                      color: (theme) => theme.palette.success.main,
                      fontWeight: 500,
                    }}
                  >
                    +{formatCurrency(totalRefundAmount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => toggleRow(customer.customerId)}
                      variant={
                        expandedRows[customer.customerId]
                          ? "contained"
                          : "outlined"
                      }
                      size="small"
                      color={
                        expandedRows[customer.customerId]
                          ? "primary"
                          : "inherit"
                      }
                      endIcon={
                        expandedRows[customer.customerId] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      }
                    >
                      {expandedRows[customer.customerId]
                        ? "Hide History"
                        : `Refund History (${positiveRefunds?.length || 0})`}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows[customer.customerId] && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, borderBottom: "none" }}>
                      <Box sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 2, fontWeight: "bold" }}
                        >
                          Refund History for Customer: {customer.customerId}
                        </Typography>
                        {positiveRefunds?.length > 0 ? (
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Refund ID</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell>Reason</TableCell>
                                  <TableCell>Amount</TableCell>
                                  <TableCell>Payment Process</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {positiveRefunds.map((refund) => (
                                  <TableRow key={refund.id}>
                                    <TableCell>{refund.id}</TableCell>
                                    <TableCell
                                      style={{ justifyContent: "center" }}
                                    >
                                      <Chip
                                        label={refund.status}
                                        size="small"
                                        color={getStatusColor(refund.status)}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {refund.refundReason || "N/A"}
                                    </TableCell>
                                    <TableCell
                                      variant="body2"
                                      sx={{
                                        color: (theme) =>
                                          theme.palette.success.main,
                                        fontWeight: 500,
                                      }}
                                    >
                                      +{formatCurrency(refund.refundAmount)}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        onClick={() =>
                                          handleProcessClick(refund)
                                        }
                                        variant="outlined"
                                        size="small"
                                      >
                                        Process
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No refund history available for this customer
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: "#071947", fontWeight: "bold" }}
      >
        Add-On of Payment Process
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "center", sm: "flex-start" },
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          label="Search Customers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth={isMobile}
          sx={{ maxWidth: { sm: "300px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          sx={{
            p: 2,
            bgcolor: "error.light",
            color: "error.dark",
            borderRadius: 1,
            my: 2,
          }}
        >
          {error}
        </Box>
      ) : filteredCustomers.length === 0 ? (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 1,
            border: "1px dashed",
            borderColor: "divider",
            my: 2,
          }}
        >
          <Typography>No refund requests found</Typography>
        </Box>
      ) : (
        <>
          {/* Mobile view */}
          {isMobile && (
            <Box>
              {filteredCustomers.map((customer) => (
                <MobileCustomerCard
                  key={customer.customerId}
                  customer={customer}
                />
              ))}
            </Box>
          )}

          {/* Tablet view */}
          {isTablet && <TabletView />}

          {/* Desktop view */}
          {!isMobile && !isTablet && <DesktopView />}
        </>
      )}

      {/* Process Refund Modal */}
      <ProcessModal />
    </Box>
  );
};

export default PaymentRefundAddOn;
