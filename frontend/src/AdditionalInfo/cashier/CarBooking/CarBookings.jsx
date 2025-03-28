import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Collapse,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  LocalShipping as ShippingIcon,
  Info as InfoIcon,
  AttachMoney as AttachMoneyIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

const FinanceBookingTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [financeFilter, setFinanceFilter] = useState("all"); // "all", "yes", "no"

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Fetch car bookings data from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Get the appropriate endpoint based on the active tab
        const endpoint = activeTab === 0 ? "confirmed" : "canceled";
        const response = await axios.get(
          `http://localhost:5000/api/bookings/${endpoint}`
        );
        setBookings(response.data.data); // Access the data property
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load car booking data."
        );
        console.error("Error fetching car bookings:", err);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [activeTab]);

  // Fetch booking counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/bookings/counts"
        );
        setConfirmedCount(response.data.confirmed || 0);
        setCanceledCount(response.data.canceled || 0);
      } catch (err) {
        console.error("Error fetching booking counts:", err);
      }
    };

    fetchCounts();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter bookings based on search query and finance filter
  const filteredBookings = bookings.filter((booking) => {
    // First filter by search query
    const matchesSearch =
      booking.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.mobileNumber1
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.mobileNumber2
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      `${booking.firstName} ${booking.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Then filter by finance status
    if (financeFilter === "all") {
      return matchesSearch;
    }  
  });

  // Handle navigation to edit/confirm page
  const handleConfirmClick = (customerId) => {
    navigate(`/order-edit-and-confirmed/${customerId}`);
  };

  const handleCancelClick = (customerId) => {
    navigate(`/order-cancel/${customerId}`);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "success";
      case "canceled":
        return "error";
      default:
        return "default";
    }
  };

  // Get finance status display
  const getFinanceStatus = (booking) => {
    const financeStatus = booking.additionalInfo?.finance?.toLowerCase();
    if (financeStatus === "yes") {
      return (
        <Chip
          icon={<AttachMoneyIcon />}
          label="Finance"
          size="small"
          color="primary"
          sx={{ mr: 1 }}
        />
      );
    }
    return null;
  };

  // Mobile Card Component
  const MobileBookingCard = ({ booking }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <Card
        sx={{
          mb: 2,
          borderLeft: `4px solid ${
            theme.palette[getStatusColor(booking.status)]?.main ||
            theme.palette.grey[400]
          }`,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {booking.customerId}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {getFinanceStatus(booking)}
              <Chip
                label={booking.status || "canceled"}
                size="small"
                color={getStatusColor(booking.status)}
              />
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mt: 1 }}>
            {`${booking.firstName || ""} ${booking.middleName || ""} ${
              booking.lastName || ""
            }`}
          </Typography>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {booking.status === "canceled" && (
                <Tooltip title="Confirm Order">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleConfirmClick(booking.customerId)}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {booking.status !== "canceled" && (
                <Tooltip title="Cancel Order">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleCancelClick(booking.customerId)}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {booking.email || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {booking.mobileNumber1 || "N/A"}
                    {booking.mobileNumber2 && `, ${booking.mobileNumber2}`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Car Details:</strong>{" "}
                    {booking.carBooking?.model || "N/A"} |{" "}
                    {booking.carBooking?.version || "N/A"} |{" "}
                    {booking.carBooking?.color || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Total Amount:</strong> ₹
                    {booking.grandTotal?.toLocaleString("en-IN") || "N/A"}
                  </Typography>
                </Grid>

                {booking.invoiceInfo && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Payment Status:</strong>
                      <Chip
                        label={booking.invoiceInfo.payment_status || "Unpaid"}
                        size="small"
                        color={
                          booking.invoiceInfo.payment_status === "Paid"
                            ? "success"
                            : "default"
                        }
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Grid>
                )}
                {booking.orderInfo?.delivery_date && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Delivery Date:</strong>{" "}
                      {new Date(
                        booking.orderInfo.delivery_date
                      ).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  // Common Table Cell Component
  const BookingTableCell = ({ children, hideOnMobile = false }) => (
    <TableCell
      sx={{
        display: hideOnMobile ? { xs: "none", sm: "table-cell" } : "table-cell",
        verticalAlign: "top",
      }}
    >
      {children}
    </TableCell>
  );

  // Tablet/Desktop Row Component
  const BookingRow = ({ booking }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <BookingTableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </BookingTableCell>
          <BookingTableCell>{booking.customerId}</BookingTableCell>
          <BookingTableCell>
            {`${booking.firstName || ""} ${booking.lastName || ""}`}
            {isMobile && (
              <Typography variant="body2" color="text.secondary">
                {booking.mobileNumber1 || "N/A"}
              </Typography>
            )}
          </BookingTableCell>
          <BookingTableCell hideOnMobile>
            {booking.mobileNumber1 || "N/A"}
            {booking.mobileNumber2 && `, ${booking.mobileNumber2}`}
          </BookingTableCell>
          <BookingTableCell hideOnMobile>
            {booking.email || "N/A"}
          </BookingTableCell>
          <BookingTableCell hideOnMobile>
            {booking.carBooking?.model || "N/A"} |{" "}
            {booking.carBooking?.version || "N/A"}
          </BookingTableCell>
          <BookingTableCell hideOnMobile>
            ₹{booking.grandTotal?.toLocaleString("en-IN") || "N/A"}
          </BookingTableCell>
          <BookingTableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {getFinanceStatus(booking)}
              <Chip
                label={booking.status || "canceled"}
                size="small"
                color={getStatusColor(booking.status)}
              />
            </Box>
          </BookingTableCell>
          <BookingTableCell>
          <Box sx={{ 
  display: "flex", 
  gap: 1,
  }}>
  {/* Confirm Order Button (shown when status is canceled) */}
  {booking.status === "canceled" && (
    <Tooltip title="Confirm this order">
      <Button
        variant="contained"
        size="small"
        color="success"
        startIcon={<CheckCircleIcon fontSize="small" />}
        onClick={() => handleConfirmClick(booking.customerId)}
        sx={{
          textTransform: 'none',
          minWidth: '100px',
          '&:hover': {
            backgroundColor: theme.palette.success.dark
          }
        }}
      >
        Confirm
      </Button>
    </Tooltip>
  )}

  {/* Cancel Order Button (shown when status is not canceled) */}
  {booking.status !== "canceled" && (
    <Tooltip title="Cancel this order">
      <Button
        variant="outlined"
        size="small"
        color="error"
        startIcon={<CancelIcon fontSize="small" />}
        onClick={() => handleCancelClick(booking.customerId)}
        sx={{
          textTransform: 'none',
          minWidth: '100px',
          borderColor: theme.palette.error.main,
          color: theme.palette.error.main,
          '&:hover': {
            backgroundColor: theme.palette.error.light,
            borderColor: theme.palette.error.dark
          }
        }}
      >
        Cancel
      </Button>
    </Tooltip>
  )}

 
</Box>
          </BookingTableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={isMobile ? 4 : 9}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Grid container spacing={2}>
                  {isMobile && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Email:</strong> {booking.email || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Secondary Phone:</strong>{" "}
                          {booking.mobileNumber2 || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Car Color:</strong>{" "}
                          {booking.carBooking?.color || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Payment Status:</strong>{" "}
                          {booking.invoiceInfo?.payment_status || "N/A"}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Address:</strong> {booking.address || "N/A"},{" "}
                      {booking.city || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>State/Country:</strong> {booking.state || "N/A"},{" "}
                      {booking.country || "N/A"}
                    </Typography>
                  </Grid>

                  {/* Prebooking Information Section */}
                  {booking.orderInfo && (
                    <>
                      <Grid item xs={12}>
                        {/* Prebooking Details (shown when prebooking exists) */}
                        {booking.orderInfo.prebooking === "YES" && (
                          <>
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                              Prebooking Details:
                            </Typography>
                            <Grid container spacing={1}>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2">
                                  <strong>Prebooking Status:</strong>{" "}
                                  {booking.orderInfo.prebooking}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2">
                                  <strong>Prebooking Date:</strong>{" "}
                                  {booking.orderInfo.prebooking_date
                                    ? new Date(
                                        booking.orderInfo.prebooking_date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2">
                                  <strong>Delivery Date:</strong>{" "}
                                  {booking.orderInfo.delivery_date
                                    ? new Date(
                                        booking.orderInfo.delivery_date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        )}

                        {/* Order Dates Section (shown when order dates exist) */}
                        {booking.orderInfo.order_date && (
                          <>
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                              Order Dates:
                            </Typography>
                            <Grid container spacing={1}>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2">
                                  <strong>Tentative Date:</strong>{" "}
                                  {booking.orderInfo.tentative_date
                                    ? new Date(
                                        booking.orderInfo.tentative_date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2">
                                  <strong>Preferred Date:</strong>{" "}
                                  {booking.orderInfo.preferred_date
                                    ? new Date(
                                        booking.orderInfo.preferred_date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="body2">
                                  <strong>Request Date:</strong>{" "}
                                  {booking.orderInfo.request_date
                                    ? new Date(
                                        booking.orderInfo.request_date
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </>
                  )}

                  {booking.additionalInfo && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mt: 1, mb: 2 }}>
                          Additional Services:
                        </Typography>
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                          <Table
                            size="small"
                            aria-label="additional services table"
                          >
                            <TableBody>
                              <TableRow>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Exchange
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.exchange || "N/A"}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Finance
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.finance || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Accessories
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.accessories || "N/A"}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Coating
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.coating || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Fast Tag
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.fast_tag || "N/A"}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Insurance
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.insurance || "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  RTO
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.rto || "N/A"}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Extended Warranty
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.extended_warranty ||
                                    "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Auto Card
                                </TableCell>
                                <TableCell>
                                  {booking.additionalInfo.auto_card || "N/A"}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                ></TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          color: "#071947",
          display: "flex",
          alignItems: "center",
          p: { xs: 1, sm: 2, md: 3 },
          pt: { xs: 2, sm: 3 },
        }}
      >
        CAR BOOKING MANAGEMENT
      </Typography>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="finance booking tabs"
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab
            icon={
              <Badge badgeContent={confirmedCount} color="success" max={999}>
                <CheckCircleIcon />
              </Badge>
            }
            label="Confirmed"
            iconPosition="start"
            sx={{
              minHeight: 48,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              textTransform: "none",
            }}
          />
          <Tab
            icon={
              <Badge badgeContent={canceledCount} color="error" max={999}>
                <CancelIcon />
              </Badge>
            }
            label="Canceled"
            iconPosition="start"
            sx={{
              minHeight: 48,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              textTransform: "none",
            }}
          />
        </Tabs>
      </Box>

      {/* Search and Filter */}
      <Box
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          mb: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search by ID, name, phone..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: "100%", sm: "350px" } }}
        />

  
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", color: "error.main", my: 4 }}>
          <Typography>{error}</Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <>
          {/* Mobile View - Card Layout */}
          {isMobile && (
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <MobileBookingCard
                    key={booking.customerId}
                    booking={booking}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", my: 4 }}>
                  <Typography>
                    No finance bookings found matching your criteria.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Tablet/Desktop View - Table Layout */}
          {!isMobile && (
            <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, pt: 0 }}>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: "calc(100vh - 250px)", overflow: "auto" }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <BookingTableCell width="50px" />
                      <BookingTableCell>Customer ID</BookingTableCell>
                      <BookingTableCell>Name</BookingTableCell>
                      <BookingTableCell hideOnMobile>Phone</BookingTableCell>
                      <BookingTableCell hideOnMobile>Email</BookingTableCell>
                      <BookingTableCell hideOnMobile>
                        Model | Version
                      </BookingTableCell>
                      <BookingTableCell hideOnMobile>Amount</BookingTableCell>
                      <BookingTableCell>Status</BookingTableCell>
                      <BookingTableCell>Actions</BookingTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <BookingRow
                          key={booking.customerId}
                          booking={booking}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={isMobile ? 4 : 9}
                          sx={{ textAlign: "center" }}
                        >
                          No finance bookings found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default FinanceBookingTabs;
