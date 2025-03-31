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
import { SearchIcon } from "lucide-react";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Cancel from "@mui/icons-material/Cancel";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import HelpOutline from "@mui/icons-material/HelpOutline";

const PADiRejected = () => {
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
  const [expandedRow, setExpandedRow] = useState(null);
  const [statusData, setStatusData] = useState([]);

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

  // Filter customers based on search query and rejected status
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.predeliveryinspection[0]?.status === "Rejected" &&
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
          status: "Approval",
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "Approval":
        return <CheckCircleOutline color="success" fontSize="small" />;
      case "Rejected":
        return <Cancel color="error" fontSize="small" />;
      case "Pending":
        return <HourglassEmpty color="warning" fontSize="small" />;
      default:
        return <HelpOutline color="disabled" fontSize="small" />;
    }
  };

  const handleViewStatus = (customer) => {
    const statuses = [];

    if (customer.accessoriesRequests.length > 0) {
      customer.accessoriesRequests.forEach((accessory) => {
        statuses.push({
          id: accessory.id,
          name: "Accessories",
          status: accessory.status,
          updatedAt: accessory.updatedAt,
        });
      });
    }

    if (customer.coatingRequests.length > 0) {
      customer.coatingRequests.forEach((coating) => {
        statuses.push({
          id: coating.id,
          name: "Coating",
          status: coating.status,
          updatedAt: coating.updatedAt,
        });
      });
    }

    if (customer.RTORequests.length > 0) {
      customer.RTORequests.forEach((rto) => {
        statuses.push({
          id: rto.id,
          name: "RTO",
          status: rto.status,
          updatedAt: rto.updatedAt,
        });
      });
    }

    if (customer.fasttagRequests.length > 0) {
      customer.fasttagRequests.forEach((fasttag) => {
        statuses.push({
          id: fasttag.id,
          name: "Fast Tag",
          status: fasttag.status,
          updatedAt: fasttag.updatedAt,
        });
      });
    }

    if (customer.insuranceRequests.length > 0) {
      customer.insuranceRequests.forEach((insurance) => {
        statuses.push({
          id: insurance.id,
          name: "Insurance",
          status: insurance.status,
          updatedAt: insurance.updatedAt,
        });
      });
    }

    if (customer.autocardRequests.length > 0) {
      customer.autocardRequests.forEach((autocard) => {
        statuses.push({
          id: autocard.id,
          name: "Auto Card",
          status: autocard.status,
          updatedAt: autocard.updatedAt,
        });
      });
    }

    setStatusData(statuses);
    setExpandedRow(
      expandedRow === customer.customerId ? null : customer.customerId
    );
  };

  // Mobile view for customer cards
  const MobileCustomerCard = ({ customer }) => {
    return (
      <Card sx={{ mb: 2, borderLeft: "4px solid #f44336" }}>
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
                color="error"
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
            <Grid
              container
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Chip label="Rejected" color="error" size="small" />
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewStatus(customer)}
              >
                View
              </Button>
            </Grid>

            {expandedRow === customer.customerId && (
              <TableRow>
                <TableCell colSpan={7} sx={{ p: 0, borderBottom: "none" }}>
                  <Box sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                    {statusData.length > 0 ? (
                      <Grid container spacing={2}>
                        {/* Vehicle Information Card */}
                        <Grid item xs={12}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                              >
                                Vehicle Information
                              </Typography>
                              <Grid container spacing={1}>
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    <Box component="span" fontWeight="bold">
                                      Model:
                                    </Box>{" "}
                                    {customer.carBooking?.model || "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    <Box component="span" fontWeight="bold">
                                      Version:
                                    </Box>{" "}
                                    {customer.carBooking?.version || "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    <Box component="span" fontWeight="bold">
                                      Color:
                                    </Box>{" "}
                                    {customer.carBooking?.color || "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    <Box component="span" fontWeight="bold">
                                      VIN:
                                    </Box>{" "}
                                    {customer.stockInfo?.vin || "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    <Box component="span" fontWeight="bold">
                                      Chassis:
                                    </Box>{" "}
                                    {customer.stockInfo?.chassisNumber || "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2">
                                    <Box component="span" fontWeight="bold">
                                      Engine:
                                    </Box>{" "}
                                    {customer.stockInfo?.engineNumber || "N/A"}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>

                        {/* Status Timeline Card */}
                        <Grid item xs={12}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                              >
                                Process Status
                              </Typography>
                              <Grid container spacing={1}>
                                {statusData.map((status) => (
                                  <Grid item xs={12} key={status.id}>
                                    <Card variant="outlined" sx={{ p: 1 }}>
                                      <Grid container alignItems="center">
                                        <Grid item xs={6}>
                                          <Typography
                                            variant="body2"
                                            fontWeight="medium"
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
                                              sx={{ ml: 1 }}
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
                                            Last updated:{" "}
                                            {formatDate(status.updatedAt)}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No status data available
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
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
            <>
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
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewStatus(customer)}
                    >
                      View
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowModal(true);
                      }}
                    >
                      <GppBadRoundedIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
              {expandedRow === customer.customerId && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, borderBottom: "none" }}>
                    <Box sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                      {statusData.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Vehicle Information
                                </Typography>
                                <Grid container spacing={1}>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Model:
                                      </Box>{" "}
                                      {customer.carBooking?.model || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Version:
                                      </Box>{" "}
                                      {customer.carBooking?.version || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Color:
                                      </Box>{" "}
                                      {customer.carBooking?.color || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        VIN:
                                      </Box>{" "}
                                      {customer.stockInfo?.vin || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Chassis:
                                      </Box>{" "}
                                      {customer.stockInfo?.chassisNumber ||
                                        "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Engine:
                                      </Box>{" "}
                                      {customer.stockInfo?.engineNumber ||
                                        "N/A"}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item xs={12}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Process Status
                                </Typography>
                                <Grid container spacing={1}>
                                  {statusData.map((status) => (
                                    <Grid item xs={12} key={status.id}>
                                      <Card variant="outlined" sx={{ p: 1 }}>
                                        <Grid container alignItems="center">
                                          <Grid item xs={6}>
                                            <Typography
                                              variant="body2"
                                              fontWeight="medium"
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
                                                sx={{ ml: 1 }}
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
                                              Last updated:{" "}
                                              {formatDate(status.updatedAt)}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No status data available
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </>
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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <>
              <TableRow
                key={customer.customerId}
                sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
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
                  <Chip label="Rejected" color="error" size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewStatus(customer)}
                    >
                      View
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowModal(true);
                      }}
                    >
                      <GppBadRoundedIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
              {expandedRow === customer.customerId && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, borderBottom: "none" }}>
                    <Box sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                      {statusData.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Vehicle Information
                                </Typography>
                                <Grid container spacing={1}>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Model:
                                      </Box>{" "}
                                      {customer.carBooking?.model || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Version:
                                      </Box>{" "}
                                      {customer.carBooking?.version || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Color:
                                      </Box>{" "}
                                      {customer.carBooking?.color || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        VIN:
                                      </Box>{" "}
                                      {customer.stockInfo?.vin || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Chassis:
                                      </Box>{" "}
                                      {customer.stockInfo?.chassisNumber ||
                                        "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <Box component="span" fontWeight="bold">
                                        Engine:
                                      </Box>{" "}
                                      {customer.stockInfo?.engineNumber ||
                                        "N/A"}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item xs={12}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Process Status
                                </Typography>
                                <Grid container spacing={1}>
                                  {statusData.map((status) => (
                                    <Grid item xs={12} key={status.id}>
                                      <Card variant="outlined" sx={{ p: 1 }}>
                                        <Grid container alignItems="center">
                                          <Grid item xs={6}>
                                            <Typography
                                              variant="body2"
                                              fontWeight="medium"
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
                                                sx={{ ml: 1 }}
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
                                              Last updated:{" "}
                                              {formatDate(status.updatedAt)}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No status data available
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </>
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
        Pre-Delivery Inspection Rejected
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
          <Typography>No rejected PDI customers found</Typography>
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

      {/* Approval Dialog - Using Material UI Dialog instead of React Bootstrap Modal */}
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

              <Card variant="outlined" sx={{ mb: 3, p: 2, bgcolor: "white" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Rejection Reason
                </Typography>
                <Typography variant="body1" color="error.dark">
                  {selectedCustomer.predeliveryinspection[0]
                    ?.PreDeliveryInspectionReason || "No reason provided"}
                </Typography>
              </Card>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Add Approval Notes (Optional)
              </Typography>
              <TextareaAutosize
                minRows={3}
                placeholder="Add notes for approval"
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

              {error && (
                <Box
                  sx={{
                    p: 1,
                    mt: 2,
                    bgcolor: "error.light",
                    color: "error.dark",
                    borderRadius: 1,
                  }}
                >
                  {error}
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PADiRejected;
