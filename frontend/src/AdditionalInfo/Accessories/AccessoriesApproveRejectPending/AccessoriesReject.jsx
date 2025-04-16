import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Box,
  Collapse,
  IconButton,
  Chip,
  Modal,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Description as DescriptionIcon,
  VerifiedRounded as VerifiedRoundedIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CardGiftcard as CardGiftcardIcon,
} from "@mui/icons-material";

// Mobile Card Component
const AccessoriesMobileCard = ({
  customer,
  order,
  handleDetailsClick,
  handleApprove,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f57c00";
      case "Approval":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <Card sx={{ mb: 2, border: `1px solid ${getStatusColor(order?.status)}` }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {customer.customerId}
          </Typography>
          <Chip
            label={order?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(order?.status),
              color: "white",
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {`${customer.firstName} ${customer.middleName || ""} ${
            customer.lastName
          }`}
        </Typography>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            size="small"
            startIcon={<DescriptionIcon />}
            onClick={() => handleDetailsClick(order, customer)}
          >
            Products ({order.products?.length || 0})
          </Button>
          <IconButton size="small" onClick={toggleExpand}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Details
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, fontSize: "1rem" }}>
                Allotment Car Details
              </Typography>

              <Typography variant="body2">
                <strong>Allotment Status:</strong>{" "}
                {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
              </Typography>
              <Typography variant="body2">
                <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Chassis Number:</strong>{" "}
                {customer?.stockInfo?.chassisNumber || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Engine Number:</strong>{" "}
                {customer?.stockInfo?.engineNumber || "N/A"}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2, fontSize: "1rem" }}>
                Accessories Updated
              </Typography>
              <Typography variant="body2">
                <strong>Car Details:</strong>{" "}
                {customer.carBooking?.model || "N/A"} |{" "}
                {customer.carBooking?.version || "N/A"}
              </Typography>

              <Typography variant="body2">
                <strong>Created At:</strong>{" "}
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Updated At:</strong>{" "}
                {order?.updatedAt
                  ? new Date(order.updatedAt).toLocaleString()
                  : "N/A"}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "red" }}
                  >
                    <strong style={{ color: "black" }}>
                      Rejection Reason:
                    </strong>{" "}
                    {order.accessorieReason}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={() => handleApprove(customer)}
                >
                  Approve
                </Button>
              </Box>
            </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

// Tablet Row Component
const AccessoriesTabletRow = ({
  customer,
  order,
  handleDetailsClick,
  handleApprove,
}) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f57c00";
      case "Approval":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.customerId}</TableCell>
        <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
        <TableCell>₹{order.totalAmount}</TableCell>
        <TableCell>
          <Chip
            label={order?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(order?.status),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleDetailsClick(order, customer)}
          >
            Products ({order.products?.length || 0})
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Details
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, fontSize: "1rem" }}>
                Allotment Car Details
              </Typography>

              <Typography variant="body2">
                <strong>Allotment Status:</strong>{" "}
                {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
              </Typography>
              <Typography variant="body2">
                <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Chassis Number:</strong>{" "}
                {customer?.stockInfo?.chassisNumber || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Engine Number:</strong>{" "}
                {customer?.stockInfo?.engineNumber || "N/A"}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2, fontSize: "1rem" }}>
                Accessories Updated
              </Typography>
              <Typography variant="body2">
                <strong>Car Details:</strong>{" "}
                {customer.carBooking?.model || "N/A"} |{" "}
                {customer.carBooking?.version || "N/A"}
              </Typography>

              <Typography variant="body2">
                <strong>Created At:</strong>{" "}
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Updated At:</strong>{" "}
                {order?.updatedAt
                  ? new Date(order.updatedAt).toLocaleString()
                  : "N/A"}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "red" }}
                  >
                    <strong style={{ color: "black" }}>
                      Rejection Reason:
                    </strong>{" "}
                    {order.accessorieReason}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={() => handleApprove(customer)}
                >
                  Approve
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Desktop Row Component
const AccessoriesDesktopRow = ({
  customer,
  order,
  handleDetailsClick,
  handleApprove,
}) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f57c00";
      case "Approval":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.customerId}</TableCell>
        <TableCell>{`${customer.firstName} ${customer.middleName || ""} ${
          customer.lastName
        }`}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>
          {customer.carBooking?.model || "N/A"} |{" "}
          {customer.carBooking?.version || "N/A"} |{" "}
          {customer.carBooking?.color || "N/A"}
        </TableCell>
        <TableCell>₹{order.totalAmount}</TableCell>
        <TableCell>
          <Chip
            label={order?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(order?.status),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleDetailsClick(order, customer)}
            >
              Products ({order.products?.length || 0})
            </Button>
            <IconButton
              size="small"
              color="success"
              onClick={() => handleApprove(customer)}
              title="Approve"
            >
              <CheckIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Allotment Car Details
              </Typography>

              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Details
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, fontSize: "1rem" }}>
                  Allotment Car Details
                </Typography>

                <Typography variant="body2">
                  <strong>Allotment Status:</strong>{" "}
                  {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
                </Typography>
                <Typography variant="body2">
                  <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Chassis Number:</strong>{" "}
                  {customer?.stockInfo?.chassisNumber || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Engine Number:</strong>{" "}
                  {customer?.stockInfo?.engineNumber || "N/A"}
                </Typography>

                <Typography variant="h6" sx={{ mt: 2, fontSize: "1rem" }}>
                  Accessories Updated
                </Typography>
                <Typography variant="body2">
                  <strong>Created At:</strong>{" "}
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Updated At:</strong>{" "}
                  {order?.updatedAt
                    ? new Date(order.updatedAt).toLocaleString()
                    : "N/A"}
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Rejection Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "red" }}
                  >
                    <strong style={{ color: "black" }}>
                      Rejection Reason:
                    </strong>{" "}
                    {order.accessorieReason}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Details Modal Component
const AccessoriesDetailsModal = ({
  open,
  handleClose,
  selectedOrder,
  selectedCustomer,
  handleApprove,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="accessories-details-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "70%" },
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Typography
          id="accessories-details-modal-title"
          variant="h6"
          component="h2"
        >
          Accessories Order Details
        </Typography>

        {selectedOrder && selectedCustomer && (
          <>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Typography variant="body1">
                    <strong>Customer ID:</strong> {selectedCustomer.customerId}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Typography variant="body1">
                    <strong>Full Name:</strong>{" "}
                    {`${selectedCustomer.firstName} ${
                      selectedCustomer.middleName || ""
                    } ${selectedCustomer.lastName}`}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Mobile Number:</strong>{" "}
                    {selectedCustomer.mobileNumber1},{" "}
                    {selectedCustomer.mobileNumber2}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedCustomer.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{ color: "red", fontWeight: "bold" }}
                  >
                    <strong style={{ color: "black" }}>
                      Rejection Reason:
                    </strong>{" "}
                    {selectedOrder.accessorieReason}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Products
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove(selectedCustomer)}
              >
                Approve
              </Button>
              <Button onClick={handleClose} variant="outlined">
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

// Main Component
const AccessoriesReject = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [accessoriesCustomers, setAccessoriesCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [accessoriesDetailsModalOpen, setAccessoriesDetailsModalOpen] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/getOrdersWithCustomers"
        );

        if (response.data && Array.isArray(response.data.data)) {
          // Filter to show only Rejected requests by default
          const RejectedCustomers = response.data.data.filter(
            (customer) =>
              customer.accessoriesRequests &&
              customer.accessoriesRequests.some(
                (accessoriesRequests) =>
                  accessoriesRequests.status === "Rejected"
              )
          );

          setAccessoriesCustomers(RejectedCustomers);
        } else {
          throw new Error("Invalid data format");
        }

        setLoading(false);
      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter customers based on search query (only Rejected shown)
  const getFilteredAccessoriesCustomers = () => {
    return accessoriesCustomers.filter(
      (customer) =>
        customer.customerId?.toString().includes(searchQuery) ||
        customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle accessories details modal
  const handleAccessoriesDetailsClick = (order, customer) => {
    setSelectedOrder(order);
    setSelectedCustomer(customer);
    setAccessoriesDetailsModalOpen(true);
  };

  // Handle approve action for accessories
  const handleAccessoriesApprove = async (customer) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/accessoriesapproval/update-status/${customer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Accessories approved successfully!");
        setAccessoriesDetailsModalOpen(false);

        // Refresh the data to show updated status
        const newData = await axios.get(
          "http://localhost:5000/api/getOrdersWithCustomers"
        );
        const RejectedCustomers = newData.data.data.filter(
          (customer) =>
            customer.accessoriesRequests &&
            customer.accessoriesRequests.some(
              (accessoriesRequests) => accessoriesRequests.status === "Rejected"
            )
        );
        setAccessoriesCustomers(RejectedCustomers);
      }
    } catch (err) {
      setError(
        `Failed to approve accessories: ${
          err.response?.data?.error || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, color: "#071947", display: "flex", alignItems: "center" }}
      >
        <CardGiftcardIcon sx={{ mr: 1 }} /> Accessories Requests - Rejected
      </Typography>

      <Box
        sx={{
          mt: 3,
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "center", sm: "flex-start" },
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search by ID, name..."
          size={isMobile ? "small" : "medium"}
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", color: "error.main", my: 4 }}>
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <>
          {/* Mobile View - Card Layout */}
          {isMobile && (
            <Box>
              {getFilteredAccessoriesCustomers().length > 0 ? (
                getFilteredAccessoriesCustomers().map((customer) =>
                  customer.accessoriesRequests
                    .filter((order) => order.status === "Rejected")
                    .map((order) => (
                      <AccessoriesMobileCard
                        key={`${customer.customerId}-${order.orderId}`}
                        customer={customer}
                        order={order}
                        handleDetailsClick={handleAccessoriesDetailsClick}
                        handleApprove={handleAccessoriesApprove}
                      />
                    ))
                )
              ) : (
                <Box sx={{ textAlign: "center", my: 4 }}>
                  <Typography>
                    No Rejected accessories requests found.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Tablet View - Simplified Table */}
          {isTablet && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="50px" />
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredAccessoriesCustomers().length > 0 ? (
                    getFilteredAccessoriesCustomers().map((customer) =>
                      customer.accessoriesRequests
                        .filter((order) => order.status === "Rejected")
                        .map((order) => (
                          <AccessoriesTabletRow
                            key={`${customer.customerId}-${order.orderId}`}
                            customer={customer}
                            order={order}
                            handleDetailsClick={handleAccessoriesDetailsClick}
                            handleApprove={handleAccessoriesApprove}
                          />
                        ))
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                        No Rejected accessories requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Desktop View - Full Table */}
          {isDesktop && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="50px" />
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Car Details</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredAccessoriesCustomers().length > 0 ? (
                    getFilteredAccessoriesCustomers().map((customer) =>
                      customer.accessoriesRequests
                        .filter((order) => order.status === "Rejected")
                        .map((order) => (
                          <AccessoriesDesktopRow
                            key={`${customer.customerId}-${order.orderId}`}
                            customer={customer}
                            order={order}
                            handleDetailsClick={handleAccessoriesDetailsClick}
                            handleApprove={handleAccessoriesApprove}
                          />
                        ))
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                        No Rejected accessories requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Accessories Details Modal */}
      <AccessoriesDetailsModal
        open={accessoriesDetailsModalOpen}
        handleClose={() => setAccessoriesDetailsModalOpen(false)}
        selectedOrder={selectedOrder}
        selectedCustomer={selectedCustomer}
        handleApprove={handleAccessoriesApprove}
      />
    </Box>
  );
};

export default AccessoriesReject;
