"use client";

import { useState, useEffect } from "react";
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
  TextareaAutosize,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { SearchIcon, DoorClosedIcon as CloseIcon } from "lucide-react";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";

const PADPending = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [preDeliveryInspectionReason, setPreDeliveryInspectionReason] =
    useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Fetch customers with Gatepass data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/showPreDeliveryInspection"
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

  // Filter customers based on search query and pending status
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.predeliveryinspection[0]?.status !== "approved" &&
      customer.predeliveryinspection[0]?.status !== "rejected" &&
      (customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle Gatepass approval
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/preInspectionapproved/${selectedCustomer.customerId}`,
        {
          status: "Approved",
          preDeliveryInspectionReason: null, // Reason is optional for approval
        }
      );

      if (response.status === 200) {
        alert("PDI approved successfully!");
        handleClose();

        const newData = await axios.get(
          "http://localhost:5000/api/showPreDeliveryInspection"
        );
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to approve PDI: ${err.response?.data?.error || err.message}`
      );
      console.error("Error:", err);
    }
  };

  // Handle Gatepass rejection
  const handleReject = async () => {
    if (!preDeliveryInspectionReason) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/preInspectionRejection/${selectedCustomer.customerId}`,
        {
          status: "Rejected",
          preDeliveryInspectionReason,
        }
      );

      if (response.status === 200) {
        alert("PDI rejected successfully!");
        handleClose();
        const newData = await axios.get(
          "http://localhost:5000/api/showPreDeliveryInspection"
        );
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to reject PDI: ${err.response?.data?.error || err.message}`
      );
      console.error("Error:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsConfirmed(false);
    setPreDeliveryInspectionReason("");
    setError(null);
  };

  // Format phone numbers for better display
  const formatPhoneNumber = (phone1, phone2) => {
    let formattedNumber = phone1 || "";
    if (phone2) {
      formattedNumber += phone2 ? ` / ${phone2}` : "";
    }
    return formattedNumber || "N/A";
  };

  // Mobile view for customer cards
  const MobileCustomerCard = ({ customer }) => {
    return (
      <Card sx={{ mb: 2, borderLeft: "4px solid #ff8c1a " }}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {`${customer.firstName} ${customer.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {customer.customerId}
              </Typography>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
            >
              <IconButton
                size="small"
                color="warning"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setShowModal(true);
                }}
              >
                <GppBadRoundedIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                Contact:{" "}
                {formatPhoneNumber(
                  customer.mobileNumber1,
                  customer.mobileNumber2
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">{customer.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                Car: {customer.carBooking?.model || "N/A"} |{" "}
                {customer.carBooking?.version || "N/A"} |{" "}
                {customer.carBooking?.color || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Chip
                label="Pending"
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
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
            <TableCell>Contact</TableCell>
            <TableCell>Car Details</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.customerId}>
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
              <TableCell>
                {formatPhoneNumber(
                  customer.mobileNumber1,
                  customer.mobileNumber2
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {customer.carBooking?.model || "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {customer.carBooking?.version || "N/A"} |{" "}
                  {customer.carBooking?.color || "N/A"}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chip label="Pending" color="warning" size="small" />
                  <IconButton
                    size="small"
                    color="warning"
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
          ))}
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
            <TableCell>Contact</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Car Details</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow
              key={customer.customerId}
              sx={{ "&:hover": { backgroundColor: "rgba(120, 96, 96, 0.04)" } }}
            >
              <TableCell>{customer.customerId}</TableCell>
              <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
              <TableCell>
                {formatPhoneNumber(
                  customer.mobileNumber1,
                  customer.mobileNumber2
                )}
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {customer.carBooking?.model || "N/A"} |{" "}
                {customer.carBooking?.version || "N/A"} |{" "}
                {customer.carBooking?.color || "N/A"}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chip label="Pending" color="warning" size="small" />
                  <IconButton
                    size="small"
                    color="warning"
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
        Pre-Delivery Inspection Pending
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
      ) : success ? (
        <Box
          sx={{
            p: 2,
            bgcolor: "success.light",
            color: "success.dark",
            borderRadius: 1,
            my: 2,
          }}
        >
          {success}
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
          <Typography>No Pending PDI customers found</Typography>
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

      {/*"Pending" Dialog - Using Material UI Dialog instead of React Bootstrap Modal */}
      <Dialog
        open={showModal}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
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
          <Typography variant="h6">Process Pre-Delivery Inspection</Typography>
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

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Reject Notes
              </Typography>
              <TextareaAutosize
                minRows={3}
                placeholder="Add notes for reject"
                value={preDeliveryInspectionReason}
                onChange={(e) => setPreDeliveryInspectionReason(e.target.value)}
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
            Approve PDI
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            disabled={!preDeliveryInspectionReason}
            variant="contained"
          >
            Reject PDI
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PADPending;
