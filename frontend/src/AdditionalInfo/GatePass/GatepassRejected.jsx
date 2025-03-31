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
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextareaAutosize,
} from "@mui/material";
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from "@mui/icons-material";

import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";
import CloseIcon from "@mui/icons-material/Close";

const GatepassRejected = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [gatepassReason, setGatepassReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Fetch customers with Gatepass data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/GatePassShow"
        );
        setCustomers(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch Gatepass data");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Generate status data when a row is expanded
  // Generate status data when a row is expanded
  useEffect(() => {
    if (expandedRow) {
      const selectedCustomer = customers.find(
        (customer) => customer.customerId === expandedRow
      );

      if (selectedCustomer) {
        const statuses = [];

        // Check and add Accessories status
        if (selectedCustomer.accessoriesRequests?.length > 0) {
          selectedCustomer.accessoriesRequests.forEach((accessory) => {
            statuses.push({
              id: accessory.id,
              name: "Accessories",
              status: accessory.status,
              reason: accessory.accessorieReason || "N/A",
              createdAt: accessory.createdAt || "N/A",
              updatedAt: accessory.updatedAt,
            });
          });
        }

        // Check and add Coating status
        if (selectedCustomer.coatingRequests?.length > 0) {
          selectedCustomer.coatingRequests.forEach((coating) => {
            statuses.push({
              id: coating.id,
              name: "Coating",
              status: coating.status,
              reason: coating.coatingReason || "N/A",
              createdAt: coating.createdAt || "N/A",

              updatedAt: coating.updatedAt,
            });
          });
        }

        // Check and add RTO status
        if (selectedCustomer.RTORequests?.length > 0) {
          selectedCustomer.RTORequests.forEach((rto) => {
            statuses.push({
              id: rto.id,
              name: "RTO",
              status: rto.status,
              reason: rto.rtoReason || "N/A",
              createdAt: rto.createdAt || "N/A",

              updatedAt: rto.updatedAt,
            });
          });
        }

        // Check and add Fast Tag status
        if (selectedCustomer.fasttagRequests?.length > 0) {
          selectedCustomer.fasttagRequests.forEach((fasttag) => {
            statuses.push({
              id: fasttag.id,
              name: "Fast Tag",
              status: fasttag.status,
              reason: fasttag.fasttagReason || "N/A",
              createdAt: fasttag.createdAt || "N/A",

              updatedAt: fasttag.updatedAt,
            });
          });
        }

        // Check and add Insurance status
        if (selectedCustomer.insuranceRequests?.length > 0) {
          selectedCustomer.insuranceRequests.forEach((insurance) => {
            statuses.push({
              id: insurance.id,
              name: "Insurance",
              status: insurance.status,
              reason: insurance.insuranceReason || "N/A",
              createdAt: insurance.createdAt || "N/A",
              updatedAt: insurance.updatedAt,
            });
          });
        }

        // Check and add Auto Card status
        if (selectedCustomer.autocardRequests?.length > 0) {
          selectedCustomer.autocardRequests.forEach((autocard) => {
            statuses.push({
              id: autocard.id,
              name: "Auto Card",
              status: autocard.status,
              reason: autocard.autoCardReason || "N/A",
              createdAt: autocard.createdAt || "N/A",

              updatedAt: autocard.updatedAt,
            });
          });
        }

        // Check and add PDI status
        if (selectedCustomer.predeliveryinspection?.length > 0) {
          selectedCustomer.predeliveryinspection.forEach((pdi) => {
            statuses.push({
              id: pdi.id,
              name: "Pre-Delivery Inspection",
              status: pdi.status,
              reason: pdi.PreDeliveryInspectionReason || "N/A",
              createdAt: pdi.createdAt || "N/A",

              updatedAt: pdi.updatedAt,
            });
          });
        }

        setStatusData(statuses);
      }
    } else {
      setStatusData([]);
    }
  }, [expandedRow, customers]);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.gate_pass[0]?.status === "Rejected" &&
      (customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle row expansion
  const handleRowExpand = (customerId) => {
    setExpandedRow(expandedRow === customerId ? null : customerId);
  };

  // Status icon component
  const StatusIcon = ({ status }) => {
    if (status === "Approval" || status === "Completed") {
      return <CheckCircle sx={{ color: "success.main" }} />;
    } else if (status === "Rejected") {
      return <Cancel sx={{ color: "error.main" }} />;
    } else if (status === "Pending") {
      return <HourglassEmpty sx={{ color: "warning.main" }} />;
    }
    return <HourglassEmpty sx={{ color: "text.disabled" }} />;
  };

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Handle Gatepass approval
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/GatePassapproved/${selectedCustomer.customerId}`,
        {
          status: "Approval",
          gatepassReason: null, // Reason is optional for approval
        }
      );

      if (response.status === 200) {
        alert("Gate Pass approved successfully!");
        handleClose();

        const newData = await axios.get(
          "http://localhost:5000/api/GatePassShow"
        );
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to approve Gate Pass: ${
          err.response?.data?.error || err.message
        }`
      );
      console.error("Error:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsConfirmed(false);
    setGatepassReason("");
    setError(null);
  };

  // Mobile view for customer cards
  const MobileCustomerCard = ({ customer }) => {
    const isExpanded = expandedRow === customer.customerId;

    return (
      <Card
        sx={{
          mb: 2,
          border: isExpanded
            ? `1px solid ${theme.palette.primary.main}`
            : "none",
        }}
      >
        <CardContent>
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
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowModal(true);
                  }}
                  sx={{ ml: 1 }}
                >
                  <GppBadRoundedIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="body2" sx={{ mt: 1 }}>
            {customer.email}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Car: {customer.carBooking?.model || "N/A"}
          </Typography>

          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={() => handleRowExpand(customer.customerId)}
              variant={isExpanded ? "contained" : "outlined"}
              size="small"
              color={isExpanded ? "primary" : "inherit"}
            >
              {isExpanded ? "Hide Details" : "View"}
            </Button>
            <Chip label="Rejected" color="error" size="small" />
          </Box>

          {isExpanded && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Status Details
              </Typography>

              {statusData.length > 0 ? (
                statusData.map((status) => (
                  <Card key={status.id} variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {status.name}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <StatusIcon status={status.status} />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Updated: {formatDate(status.updatedAt)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No status data available
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Desktop view with table
  const DesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer ID</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Car Details</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <React.Fragment key={customer.customerId}>
              <TableRow
                sx={{
                  backgroundColor:
                    expandedRow === customer.customerId
                      ? "rgba(0, 0, 0, 0.04)"
                      : "inherit",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                }}
              >
                <TableCell>{customer.customerId}</TableCell>
                <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.carBooking?.model || "N/A"}</TableCell>

                <TableCell>
                  <Button
                    onClick={() => handleRowExpand(customer.customerId)}
                    variant={
                      expandedRow === customer.customerId
                        ? "contained"
                        : "outlined"
                    }
                    size="small"
                    color={
                      expandedRow === customer.customerId
                        ? "primary"
                        : "inherit"
                    }
                  >
                    {expandedRow === customer.customerId ? "Hide" : "View"}
                  </Button>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip label="Rejected" color="error" size="small" />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowModal(true);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <GppBadRoundedIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
              {expandedRow === customer.customerId && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ p: 0, borderBottom: "none" }}>
                    <Box sx={{ p: 4, backgroundColor: "#f9f9f9" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      >
                        Status Details for Customer: {customer.customerId}
                      </Typography>
                      {statusData.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Service</TableCell>
                                <TableCell>Status</TableCell>

                                <TableCell>Created At</TableCell>
                                <TableCell>Updated At</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {statusData.map((status) => (
                                <TableRow key={status.id}>
                                  <TableCell>{status.name}</TableCell>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <StatusIcon status={status.status} />
                                      <Typography
                                        variant="body2"
                                        sx={{ ml: 2 }}
                                      >
                                        {status.status}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(status.createdAt)}
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(status.updatedAt)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No status data available for this customer
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
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
        Gate Pass Rejected
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
          <Typography>
            No customers found matching your search criteria
          </Typography>
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

          {/* Tablet view - simplified table */}
          {isTablet && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Car</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <React.Fragment key={customer.customerId}>
                      <TableRow
                        sx={{
                          backgroundColor:
                            expandedRow === customer.customerId
                              ? "rgba(0, 0, 0, 0.04)"
                              : "inherit",
                          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium" }}
                          >
                            {`${customer.firstName} ${customer.lastName}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.customerId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {customer.carBooking?.model || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip label="Rejected" color="error" size="small" />
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleRowExpand(customer.customerId)}
                            variant={
                              expandedRow === customer.customerId
                                ? "contained"
                                : "outlined"
                            }
                            size="small"
                            color={
                              expandedRow === customer.customerId
                                ? "primary"
                                : "inherit"
                            }
                          >
                            {expandedRow === customer.customerId
                              ? "Hide"
                              : "View"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRow === customer.customerId && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            sx={{ p: 0, borderBottom: "none" }}
                          >
                            <Box sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                              {statusData.length > 0 ? (
                                <Grid container spacing={2}>
                                  {statusData.map((status) => (
                                    <Grid item xs={12} key={status.id}>
                                      <Card variant="outlined">
                                        <CardContent
                                          sx={{
                                            p: 1,
                                            "&:last-child": { pb: 1 },
                                          }}
                                        >
                                          <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                              <Typography
                                                variant="body2"
                                                sx={{ fontWeight: "medium" }}
                                              >
                                                {status.name}
                                              </Typography>
                                            </Grid>
                                            <Grid
                                              item
                                              xs={6}
                                              sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <StatusIcon
                                                  status={status.status}
                                                />
                                                <Typography
                                                  variant="body2"
                                                  sx={{ ml: 0.5 }}
                                                >
                                                  {status.status}
                                                </Typography>
                                              </Box>
                                            </Grid>

                                            <Grid item xs={12}>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                              >
                                                Updated:{" "}
                                                {formatDate(status.updatedAt)}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </CardContent>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  No status data available
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Desktop view - full table */}
          {!isMobile && !isTablet && <DesktopView />}
        </>
      )}

      {/*"Pending" Dialog - Using Material UI Dialog instead of React Bootstrap Modal */}
      <Dialog open={showModal} onClose={handleClose} maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 1,
          }}
        >
          <Typography variant="h6">Gate Pass Rejected</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, mt: 1 }}>
          {selectedCustomer && (
            <Box>
              <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Customer Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Customer ID:
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.customerId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Name:
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Car:
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.carBooking?.model || "N/A"} |{" "}
                      {selectedCustomer.carBooking?.version || "N/A"} |{" "}
                      {selectedCustomer.carBooking?.color || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              <Card variant="outlined" sx={{ mb: 3, p: 2, bgcolor: "white" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Rejection Reason
                </Typography>
                <Typography variant="body1" color="error.dark">
                  {selectedCustomer.gate_pass[0]?.securityClearanceReason ||
                    "No reason provided"}
                </Typography>
              </Card>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Add Approval Notes (Optional)
              </Typography>
              <TextareaAutosize
                minRows={3}
                placeholder="Add notes for Approved"
                value={gatepassReason}
                onChange={(e) => setGatepassReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontFamily: "inherit",
                  fontSize: "14px",
                }}
              />

              {success && (
                <Box
                  sx={{
                    p: 1,
                    mt: 2,
                    bgcolor: "success.light",
                    color: "success.dark",
                    borderRadius: 1,
                  }}
                >
                  {success}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleApprove} variant="contained" color="success">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GatepassRejected;
