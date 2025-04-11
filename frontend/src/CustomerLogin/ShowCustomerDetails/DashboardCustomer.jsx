"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  TableHead,
} from "@mui/material";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  LogOut,
  Home,
  Car,
  FileText,
  Clock,
} from "lucide-react";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";

const DashboardCustomer = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [customerData, setCustomerData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        // Get customer from localStorage
        const storedCustomer = JSON.parse(localStorage.getItem("customer"));
        if (!storedCustomer?.customerId) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/PaymentHistory/${storedCustomer.customerId}`
        );

        if (!response.data) throw new Error("No data received");

        setCustomerData(storedCustomer);
        setPaymentData(response.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.response?.data?.error || "Failed to load data");
          if (err.response?.status === 401) navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/login");
  };

  const formatAddress = (address) => {
    return (
      address?.split(",").map((line, index) => (
        <React.Fragment key={index}>
          {line.trim()}
          <br />
        </React.Fragment>
      )) || "N/A"
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const MobileView = () => (
    <Box sx={{ p: 2 }}>
      {/* Customer Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "primary.main",
                mr: 2,
              }}
            >
              {customerData?.firstName?.charAt(0) || "C"}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {customerData?.firstName} {customerData?.lastName}
                <VerifiedRoundedIcon
                  sx={{
                    color: "#092e6b",
                    fontSize: "18px",
                    ml: 0.5,
                    verticalAlign: "middle",
                  }}
                />
              </Typography>
              <Chip
                label={customerData?.customertype || "Regular"}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CreditCard size={18} />
              </ListItemIcon>
              <ListItemText
                primary="Customer ID"
                secondary={customerData?.customerId || "N/A"}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{ variant: "body1" }}
              />
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Mail size={18} />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary={customerData?.email || "N/A"}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{ variant: "body1" }}
              />
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Phone size={18} />
              </ListItemIcon>
              <ListItemText
                primary="Phone"
                secondary={customerData?.mobileNumber1 || "N/A"}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{ variant: "body1" }}
              />
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Calendar size={18} />
              </ListItemIcon>
              <ListItemText
                primary="Birth Date"
                secondary={formatDate(customerData?.birthDate || "N/A")}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{ variant: "body1" }}
              />
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <MapPin size={18} />
              </ListItemIcon>
              <ListItemText
                primary="Address"
                secondary={formatAddress(customerData?.address)}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{ variant: "body1" }}
              />
            </ListItem>

            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Home size={18} />
              </ListItemIcon>
              <ListItemText
                primary="State/Country"
                secondary={`${customerData?.state || "N/A"}, ${
                  customerData?.country || "N/A"
                }`}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{ variant: "body1" }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Vehicle Information Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Car size={18} style={{ marginRight: 8 }} />
            Vehicle Information
          </Typography>

          {paymentData?.carbooking ? (
            <TableContainer>
              <Table size="medium">
                <TableBody>
                  <TableRow>
                    <TableCell>Car Type</TableCell>
                    <TableCell>
                      {paymentData.carbooking.carType || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cuel Type</TableCell>
                    <TableCell>
                      {paymentData.carbooking.fuelType || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Model</TableCell>
                    <TableCell>
                      {paymentData.carbooking.model || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Version</TableCell>
                    <TableCell>
                      {paymentData.carbooking.version || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Color</TableCell>
                    <TableCell>
                      {paymentData.carbooking.color || "N/A"}
                    </TableCell>
                  </TableRow>
                  {paymentData?.ordersprebookingdate?.prebooking === "YES" && (
                    <>
                      <TableRow>
                        <TableCell>Prebooking Details</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pre Booking</TableCell>
                        <TableCell>
                          {paymentData.ordersprebookingdate.prebooking || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Prebooking Date</TableCell>
                        <TableCell>
                          {formatDate(
                            paymentData.ordersprebookingdate.prebooking_date
                          ) || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Delivery Date</TableCell>
                        <TableCell>
                          {formatDate(
                            paymentData.ordersprebookingdate.delivery_date
                          ) || "N/A"}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                  {/* Order Dates Information */}
                  {paymentData?.ordersprebookingdate?.order_date === "YES" && (
                    <>
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{ pt: 2, fontWeight: "bold" }}
                        >
                          Order Dates
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tentative Date</TableCell>
                        <TableCell>
                          {formatDate(
                            paymentData.ordersprebookingdate.tentative_date
                          ) || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Preferred Date</TableCell>
                        <TableCell>
                          {formatDate(
                            paymentData.ordersprebookingdate.preferred_date
                          ) || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Request Date</TableCell>
                        <TableCell>
                          {formatDate(
                            paymentData.ordersprebookingdate.request_date
                          ) || "N/A"}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography>No vehicle information available</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* On-Road Price Details Section for Mobile */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PaymentsRoundedIcon style={{ marginRight: 8, fontSize: 18 }} />
            On-Road Price Details
          </Typography>

          {paymentData?.onRoadPriceDetails ? (
            <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
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
                          paymentData.onRoadPriceDetails.ex_showroom_price
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Accessories</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          paymentData.onRoadPriceDetails.accessories
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Discount</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          paymentData.onRoadPriceDetails.discount
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Subtotal</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          paymentData.onRoadPriceDetails.subtotal
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        GST (
                        <span
                          style={{
                            color: paymentData.onRoadPriceDetails.gst_rate
                              ? "red"
                              : "inherit",
                          }}
                        >
                          {paymentData.onRoadPriceDetails.gst_rate || 0}%
                        </span>
                        )
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          paymentData.onRoadPriceDetails.gst_amount
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        Cess (
                        <span
                          style={{
                            color: paymentData.onRoadPriceDetails.cess_rate
                              ? "red"
                              : "inherit",
                          }}
                        >
                          {paymentData.onRoadPriceDetails.cess_rate || 0}%
                        </span>
                        )
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          paymentData.onRoadPriceDetails.cess_amount
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Total On-Road Price
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(
                          paymentData.onRoadPriceDetails.total_on_road_price
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography>No pricing information available</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Additional Charges Section for Mobile */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PaymentsRoundedIcon style={{ marginRight: 8, fontSize: 18 }} />
            Additional Charges
          </Typography>

          {paymentData?.additionalCharges ? (
            <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
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
                      <TableCell>Insurance</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          paymentData.additionalCharges.insurance
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>RTO</TableCell>
                      <TableCell align="right">
                        {formatCurrency(paymentData.additionalCharges.rto)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Fast-Tag</TableCell>
                      <TableCell align="right">
                        {formatCurrency(paymentData.additionalCharges.fast_tag)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Coating</TableCell>
                      <TableCell align="right">
                        {formatCurrency(paymentData.additionalCharges.coating)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Extended Warranty</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          paymentData.additionalCharges.extended_warranty
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Autocard</TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          paymentData.additionalCharges.auto_card
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Total Charges
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(
                          paymentData.additionalCharges.total_charges
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography>
                No additional charges information available
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card
        sx={{ mb: 3, bgcolor: "primary.light", color: "primary.contrastText" }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FileText size={18} style={{ marginRight: 8 }} />
            Documents
          </Typography>

          <Box sx={{ py: 1, textAlign: "center" }}>
            <Typography variant="body2">
              View and manage your documents
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{ mt: 1.5, bgcolor: "white", color: "primary.main" }}
            >
              View Documents
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Clock size={18} style={{ marginRight: 8 }} />
            Track Your Order
          </Typography>

          <Box sx={{ py: 1, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">No recent activity</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="contained"
        color="error"
        fullWidth
        startIcon={<LogOut />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );

  // Tablet view
  const TabletView = () => (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: "primary.main",
              mr: 2,
            }}
          >
            {customerData?.firstName?.charAt(0) || "C"}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {customerData?.firstName} {customerData?.lastName}
              <VerifiedRoundedIcon
                sx={{
                  color: "#092e6b",
                  fontSize: "20px",
                  ml: 0.5,
                  verticalAlign: "middle",
                }}
              />
            </Typography>
            <Chip
              label={customerData?.customerType || "Regular"}
              size="small"
              color="primary"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <User size={18} style={{ marginRight: 8 }} />
                  Personal Information
                </Typography>

                <List disablePadding>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemText
                      primary="Customer ID"
                      secondary={customerData?.customerId || "N/A"}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>

                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemText
                      primary="Email"
                      secondary={customerData?.email || "N/A"}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>

                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemText
                      primary="Phone"
                      secondary={customerData?.mobileNumber1 || "N/A"}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText
                      primary="Birth Date"
                      secondary={formatDate(customerData?.birthDate || "N/A")}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MapPin size={18} style={{ marginRight: 8 }} />
                  Address Information
                </Typography>

                <List disablePadding>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemText
                      primary="Address"
                      secondary={formatAddress(customerData?.address)}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemText
                      primary="State/Country"
                      secondary={`${customerData?.state || "N/A"}, ${
                        customerData?.country || "N/A"
                      }`}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Add Vehicle Information Card for Tablet */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Car size={18} style={{ marginRight: 8 }} />
                  Vehicle Information
                </Typography>

                {paymentData?.carbooking ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                Model
                              </TableCell>
                              <TableCell>
                                {paymentData.carbooking.model || "N/A"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                Version
                              </TableCell>
                              <TableCell>
                                {paymentData.carbooking.version || "N/A"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                Color
                              </TableCell>
                              <TableCell>
                                {paymentData.carbooking.color || "N/A"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                Car Type
                              </TableCell>
                              <TableCell>
                                {paymentData.carbooking.carType || "N/A"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                Fuel Type
                              </TableCell>
                              <TableCell>
                                {paymentData.carbooking.fuelType || "N/A"}
                              </TableCell>
                            </TableRow>
                            {paymentData?.ordersprebookingdate?.prebooking ===
                              "YES" && (
                              <TableRow>
                                <TableCell sx={{ fontWeight: "medium" }}>
                                  Delivery Date
                                </TableCell>
                                <TableCell>
                                  {formatDate(
                                    paymentData.ordersprebookingdate
                                      .delivery_date
                                  ) || "N/A"}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                ) : (
                  <Box
                    sx={{ py: 1, textAlign: "center", color: "text.secondary" }}
                  >
                    <Typography>No vehicle information available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Add Pricing Information for Tablet */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PaymentsRoundedIcon
                    style={{ marginRight: 8, fontSize: 18 }}
                  />
                  Pricing Information
                </Typography>

                {paymentData?.onRoadPriceDetails ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        On-Road Price
                      </Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell>Ex-showroom Price</TableCell>
                              <TableCell align="right">
                                {formatCurrency(
                                  paymentData.onRoadPriceDetails
                                    .ex_showroom_price
                                )}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Total
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ fontWeight: "bold" }}
                              >
                                {formatCurrency(
                                  paymentData.onRoadPriceDetails
                                    .total_on_road_price
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Additional Charges
                      </Typography>
                      {paymentData?.additionalCharges ? (
                        <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Description
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Amount (₹)
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Insurance</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.insurance
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>RTO</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.rto
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Fast-Tag</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.fast_tag
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Coating</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.coating
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Extended Warranty</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges
                                        .extended_warranty
                                    )}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Autocard</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.auto_card
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Total Charges
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {formatCurrency(
                                      paymentData.additionalCharges
                                        .total_charges
                                    )}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            textAlign: "center",
                            color: "text.secondary",
                          }}
                        >
                          <Typography>
                            No additional charges information available
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                ) : (
                  <Box
                    sx={{ py: 1, textAlign: "center", color: "text.secondary" }}
                  >
                    <Typography>No pricing information available</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogOut />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  // Desktop view remains the same as in your code
  const DesktopView = () => (
    <Box sx={{ p: 1 }}>
      <Paper elevation={3} sx={{ p: 0, mb: 4, overflow: "hidden" }}>
        <Box
          sx={{
            p: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "white",
              color: "primary.main",
              mr: 3,
              border: "4px solid white",
            }}
          >
            {customerData?.firstName?.charAt(0) || "C"}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {customerData?.firstName} {customerData?.lastName}
              <VerifiedRoundedIcon
                sx={{
                  color: "white",
                  fontSize: "24px",
                  ml: 1,
                  verticalAlign: "middle",
                }}
              />
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <User size={20} style={{ marginRight: 8 }} />
                Customer Details
              </Typography>
              <TableContainer>
                <Table size="medium">
                  <TableBody>
                    <TableRow>
                      <TableCell
                        width="40%"
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        Customer ID
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        {customerData?.customerId || "N/A"}
                        <VerifiedRoundedIcon
                          sx={{
                            color: "#092e6b",
                            fontSize: "15px",
                            ml: 0.5,
                            verticalAlign: "middle",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        Customer Type
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        {customerData?.customertype || "Regular"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        Full Name
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        {customerData?.firstName} {customerData?.lastName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        Birth Date
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        {formatDate(customerData?.birthDate || "N/A")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        {customerData?.email || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        Phone
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                        }}
                      >
                        {customerData?.mobileNumber1 || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                          verticalAlign: "top",
                        }}
                      >
                        Address
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                          maxWidth: "300px",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                      >
                        {formatAddress(customerData?.address)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        State/Country
                      </TableCell>
                      <TableCell>
                        {customerData?.state || "N/A"},{" "}
                        {customerData?.country || "N/A"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <Card
                    variant="outlined"
                    sx={{ height: "100%", bgcolor: "background.paper" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Clock size={20} style={{ marginRight: 8 }} />
                        Recent Activity
                      </Typography>

                      <Box
                        sx={{
                          p: 2,
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        <Typography>No recent activity</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Car size={20} style={{ marginRight: 8 }} />
                        Vehicle Information
                      </Typography>

                      {paymentData?.carbooking ? (
                        <TableContainer>
                          <Table size="medium">
                            <TableBody>
                              <TableRow>
                                <TableCell>Car Type</TableCell>
                                <TableCell>
                                  {paymentData.carbooking.carType || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Cuel Type</TableCell>
                                <TableCell>
                                  {paymentData.carbooking.fuelType || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Model</TableCell>
                                <TableCell>
                                  {paymentData.carbooking.model || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Version</TableCell>
                                <TableCell>
                                  {paymentData.carbooking.version || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Color</TableCell>
                                <TableCell>
                                  {paymentData.carbooking.color || "N/A"}
                                </TableCell>
                              </TableRow>
                              {paymentData?.ordersprebookingdate?.prebooking ===
                                "YES" && (
                                <>
                                  <TableRow>
                                    <TableCell>Prebooking Details</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Pre Booking</TableCell>
                                    <TableCell>
                                      {paymentData.ordersprebookingdate
                                        .prebooking || "N/A"}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Prebooking Date</TableCell>
                                    <TableCell>
                                      {formatDate(
                                        paymentData.ordersprebookingdate
                                          .prebooking_date
                                      ) || "N/A"}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Delivery Date</TableCell>
                                    <TableCell>
                                      {formatDate(
                                        paymentData.ordersprebookingdate
                                          .delivery_date
                                      ) || "N/A"}
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                              {/* Order Dates Information */}
                              {paymentData?.ordersprebookingdate?.order_date ===
                                "YES" && (
                                <>
                                  <TableRow>
                                    <TableCell
                                      colSpan={2}
                                      sx={{ pt: 2, fontWeight: "bold" }}
                                    >
                                      Order Dates
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Tentative Date</TableCell>
                                    <TableCell>
                                      {formatDate(
                                        paymentData.ordersprebookingdate
                                          .tentative_date
                                      ) || "N/A"}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Preferred Date</TableCell>
                                    <TableCell>
                                      {formatDate(
                                        paymentData.ordersprebookingdate
                                          .preferred_date
                                      ) || "N/A"}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Request Date</TableCell>
                                    <TableCell>
                                      {formatDate(
                                        paymentData.ordersprebookingdate
                                          .request_date
                                      ) || "N/A"}
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            textAlign: "center",
                            color: "text.secondary",
                          }}
                        >
                          <Typography>
                            No vehicle information available
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Car size={20} style={{ marginRight: 8 }} />
                        Additional Service
                      </Typography>

                      {paymentData?.additionalInfo ? (
                        <TableContainer>
                          <Table size="medium">
                            <TableBody>
                              <TableRow>
                                <TableCell>Exchange</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo.exchange || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Finance</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo.finance || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Accessories</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo.accessories ||
                                    "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Coating</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo.coating || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Fast-Tag</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo.fast_tag || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>RTO</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo.rto || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Insurance</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo.insurance ||
                                    "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Extended Warranty</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo
                                    .extended_warranty || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Autocard</TableCell>
                                <TableCell>
                                  {paymentData.additionalInfo.auto_card ||
                                    "N/A"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            textAlign: "center",
                            color: "text.secondary",
                          }}
                        >
                          <Typography>
                            No vehicle information available
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <PaymentsRoundedIcon
                          size={20}
                          style={{ marginRight: 8 }}
                        />
                        On-Road Price Details
                      </Typography>

                      {paymentData?.onRoadPriceDetails ? (
                        <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Description
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Amount (₹)
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Ex-showroom Price</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.onRoadPriceDetails
                                        .ex_showroom_price
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Accessories</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.onRoadPriceDetails.accessories
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Discount</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.onRoadPriceDetails.discount
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Subtotal</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.onRoadPriceDetails.subtotal
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>
                                    GST (
                                    <span
                                      style={{
                                        color: paymentData.onRoadPriceDetails
                                          .gst_rate
                                          ? "red"
                                          : "inherit",
                                      }}
                                    >
                                      {paymentData.onRoadPriceDetails
                                        .gst_rate || 0}
                                      %
                                    </span>
                                    )
                                  </TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.onRoadPriceDetails.gst_amount
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>
                                    Cess (
                                    <span
                                      style={{
                                        color: paymentData.onRoadPriceDetails
                                          .cess_rate
                                          ? "red"
                                          : "inherit",
                                      }}
                                    >
                                      {paymentData.onRoadPriceDetails
                                        .cess_rate || 0}
                                      %
                                    </span>
                                    )
                                  </TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.onRoadPriceDetails.cess_amount
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Total On-Road Price
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {formatCurrency(
                                      paymentData.onRoadPriceDetails
                                        .total_on_road_price
                                    )}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            textAlign: "center",
                            color: "text.secondary",
                          }}
                        >
                          <Typography>
                            No pricing information available
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <PaymentsRoundedIcon
                          size={20}
                          style={{ marginRight: 8 }}
                        />
                        Additional Charges
                      </Typography>

                      {paymentData?.additionalCharges ? (
                        <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Description
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Amount (₹)
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Insurance</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.insurance
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>RTO</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.rto
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Fast-Tag</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.fast_tag
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Coating</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.coating
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>Extended Warranty</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges
                                        .extended_warranty
                                    )}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Autocard</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(
                                      paymentData.additionalCharges.auto_card
                                    )}
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Total Charges
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {formatCurrency(
                                      paymentData.additionalCharges
                                        .total_charges
                                    )}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            textAlign: "center",
                            color: "text.secondary",
                          }}
                        >
                          <Typography>
                            No additional charges information available
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <PaymentsRoundedIcon
                          size={20}
                          style={{ marginRight: 8 }}
                        />
                        Cost Summary
                      </Typography>

                      {paymentData?.invoicesummary ? (
                        <Grid container spacing={2}>
                          {/* Invoice Details */}
                          <Grid item xs={6}>
                            <Typography
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2, // Using theme spacing
                              p: 2, // Using theme spacing
                          
                              color: "text.primary",
                              }}
                              variant="body2" color="text.secondary">
                              Invoice Date
                            
                              {new Date(
                                paymentData.invoicesummary.invoice_date
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography  sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2, // Using theme spacing
                              p: 2, // Using theme spacing
                           
                              color: "text.primary",
                            }} variant="body2" color="text.secondary">
                              Due Date
                            
                              {new Date(
                                paymentData.invoicesummary.due_date
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </Typography>
                          </Grid>

                          {/* Pricing Breakdown */}
                          <Grid item xs={6}>
                            <Typography  sx={{
                              display: "flex",
                              alignItems: "center",
                           
                              p: 2, // Using theme spacing
                            
                              color: "text.primary",
                            }} variant="body2" color="text.secondary">
                              On-Road Price
                          
                              ₹
                              {parseFloat(
                                paymentData.invoicesummary.total_on_road_price
                              ).toLocaleString("en-IN")}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography  sx={{
                              display: "flex",
                              alignItems: "center",
                              
                              p: 2, // Using theme spacing
                            
                              color: "text.primary",
                            }}
                              variant="body2" color="text.secondary">
                              Additional Charges
                          
                              ₹
                              {parseFloat(
                                paymentData.invoicesummary.total_charges
                              ).toLocaleString("en-IN")}
                            </Typography>
                          </Grid>

                          {/* Totals */}
                          <Grid item xs={6}>
                            <Typography  sx={{
                              display: "flex",
                              alignItems: "center",
                            
                              p: 2, // Using theme spacing
                              mb: 2, // Using theme spacing
                              color: "text.primary",
                            }}
                              variant="body2" color="text.secondary">
                              Grand Total  ₹
                              {parseFloat(
                                paymentData.invoicesummary.grand_total
                              ).toLocaleString("en-IN")}
                            </Typography>
                          
                          </Grid>

                          
                          <Grid item xs={6}>
                            
                          <Typography
                             sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2, // Using theme spacing
                              p: 2, // Using theme spacing
                              mb: 2, // Using theme spacing
                              color: "text.primary",
                            }}
                          >
                            <Box
                              component="strong"
                              sx={{
                                flexShrink: 0,
                                fontWeight: "medium",
                                color: "text.primary",
                              }}
                            >
                              Customer Balance(Paid):
                              {paymentData?.invoicesummary
                                ?.customer_account_balance
                                ? `₹${parseFloat(
                                    paymentData.invoicesummary
                                      .customer_account_balance
                                  ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                  })}`
                                : "N/A"}
                            </Box>

                            <Box
                              sx={{
                                ml: "-15px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {(() => {
                                const iconProps = {
                                  sx: {
                                    fontSize: "1.2rem",
                                    ml: 0.5,
                                  },
                                  "aria-hidden": false,
                                  role: "img",
                                };

                                switch (
                                  paymentData.invoicesummary.payment_status
                                ) {
                                  case "Paid":
                                    return (
                                      <CheckCircleOutlineRoundedIcon
                                        {...iconProps}
                                        sx={{
                                          ...iconProps.sx,
                                          color: "success.main",
                                        }}
                                        aria-label="Payment status: Paid"
                                      />
                                    );
                                  case "Unpaid":
                                    return (
                                      <WatchLaterOutlinedIcon
                                        {...iconProps}
                                        sx={{
                                          ...iconProps.sx,
                                          color: "warning.main",
                                        }}
                                        aria-label="Payment status: Unpaid"
                                      />
                                    );
                                  default:
                                    return (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        aria-label="Payment status: Not available"
                                      >
                                        N/A
                                      </Typography>
                                    );
                                }
                              })()}
                            </Box>
                            </Typography>
                            </Grid>
                          

                          <Grid item xs={12}> 
                          <Typography
                            variant="body2"
                            sx={{ color: "error.main", mt: -4, display: "flex",
                              alignItems: "center",
                              gap: 2, // Using theme spacing
                              p: 2, }}
                         
                          >
                            <Box
                              component="span"
                              sx={{ color: "text.primary", fontWeight: "bold" }}
                            >
                              Unpaid Amount:
                            </Box>
                            {paymentData?.invoicesummary?.payment_status ===
                            "Paid" ? (
                              "₹0.00"
                            ) : (
                              <>
                                {grand_total !== "N/A" &&
                                customer_account_balance !== "N/A"
                                  ? `₹${(
                                      parseFloat(grand_total) -
                                      parseFloat(customer_account_balance)
                                    ).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                    })}`
                                  : "N/A"}
                              </>
                            )}
                            </Typography>
                            </Grid>
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No invoice summary available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <FileText size={20} style={{ marginRight: 8 }} />
                        Documents
                      </Typography>

                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography>View and manage your documents</Typography>
                        <Button
                          variant="contained"
                          sx={{
                            mt: 2,
                            bgcolor: "white",
                            color: "primary.main",
                          }}
                        >
                          View Documents
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={<LogOut />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      {isMobile ? <MobileView /> : isTablet ? <TabletView /> : <DesktopView />}
    </Box>
  );
};

export default DashboardCustomer;
