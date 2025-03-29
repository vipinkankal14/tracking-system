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
  handleReject,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f57c00";
      case "Approval": return "#4caf50";
      case "Rejected": return "#f44336";
      default: return "#9e9e9e";
    }
  };

  return (
    <Card sx={{ mb: 2, border: `1px solid ${getStatusColor(order?.status)}` }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {customer.customerId}
          </Typography>
          <Chip 
            label={order?.status || "N/A"} 
            size="small" 
            sx={{ 
              backgroundColor: getStatusColor(order?.status),
              color: "white"
            }}
          />
        </Box>
        
        <Typography variant="body2" sx={{ mt: 1 }}>
          {`${customer.firstName} ${customer.middleName || ""} ${customer.lastName}`}
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
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">
              <strong>Email:</strong> {customer.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Car Details:</strong> {customer.carBooking?.model || "N/A"} | {customer.carBooking?.version || "N/A"} | {customer.carBooking?.color || "N/A"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Total Amount:</strong> ₹{order.totalAmount}
            </Typography>
            
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button 
                variant="contained" 
                size="small" 
                color="success"
                onClick={() => handleApprove(customer)}
              >
                Approve
              </Button>
              <Button 
                variant="contained" 
                size="small" 
                color="error"
                onClick={() => handleReject(customer, order)}
              >
                Reject
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
  handleReject,
}) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f57c00";
      case "Approval": return "#4caf50";
      case "Rejected": return "#f44336";
      default: return "#9e9e9e";
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
              color: "white"
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
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {customer.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Car Details:</strong> {customer.carBooking?.model || "N/A"} | {customer.carBooking?.version || "N/A"}
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
                <Button 
                  variant="contained" 
                  size="small" 
                  color="error"
                  onClick={() => handleReject(customer, order)}
                >
                  Reject
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
  handleReject,
}) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f57c00";
      case "Approval": return "#4caf50";
      case "Rejected": return "#f44336";
      default: return "#9e9e9e";
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.customerId}</TableCell>
        <TableCell>{`${customer.firstName} ${customer.middleName || ""} ${customer.lastName}`}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>
          {customer.carBooking?.model || "N/A"} | {customer.carBooking?.version || "N/A"} | {customer.carBooking?.color || "N/A"}
        </TableCell>
        <TableCell>₹{order.totalAmount}</TableCell>
        <TableCell>
          <Chip 
            label={order?.status || "N/A"} 
            size="small" 
            sx={{ 
              backgroundColor: getStatusColor(order?.status),
              color: "white"
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
            <IconButton
              size="small"
              color="error"
              onClick={() => handleReject(customer, order)}
              title="Reject"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Additional Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2">
                    <strong>Created At:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2">
                    <strong>Updated At:</strong> {order?.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}
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
  handleReject,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="accessories-details-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: '70%' },
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        overflow: 'auto'
      }}>
        <Typography id="accessories-details-modal-title" variant="h6" component="h2">
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
           
             

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Full Name:</strong>{" "}
                    {`${selectedCustomer.firstName} ${selectedCustomer.middleName || ""} ${selectedCustomer.lastName}`}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Mobile Number:</strong>{" "}
                    {selectedCustomer.mobileNumber1}, {selectedCustomer.mobileNumber2}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedCustomer.email}
                  </Typography>
                </Grid>

               

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Car Details:</strong>{" "}
                    {`${selectedCustomer.carBooking?.model || "N/A"} | ${selectedCustomer.carBooking?.version || "N/A"} | ${selectedCustomer.carBooking?.color || "N/A"}`}
                  </Typography>
                  <Typography variant="body1">
                  <strong>VIN Number:</strong>{" "}

                     {`${selectedCustomer.stockInfo?.vin || "N/A"}`}
                  </Typography>
                  <Typography variant="body1">
                  <strong>Chassis Number:</strong>{" "}

                     {`${selectedCustomer.stockInfo?.chassisNumber || "N/A"}`}
                  </Typography>
                  <Typography variant="body1">
                  <strong>Engine Number:</strong>{" "}

                     {`${selectedCustomer.stockInfo?.engineNumber || "N/A"}`}
                  </Typography>
                </Grid>
             
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}
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
                    {selectedOrder.products?.map((product) => (
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => handleApprove(selectedCustomer)}
              >
                Approve
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => handleReject(selectedCustomer, selectedOrder)}
              >
                Reject
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

// Rejection Modal Component
const RejectionModal = ({
  open,
  handleClose,
  selectedCustomer,
  selectedItem,
  handleConfirmReject,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState(null);

  const confirmReject = () => {
    if (!isConfirmed) {
      setError("Please confirm the rejection");
      return;
    }

    if (!rejectReason) {
      setError("Please provide a reason for rejection");
      return;
    }

    handleConfirmReject(selectedCustomer, rejectReason);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="rejection-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: '50%' },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography id="rejection-modal-title" variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <strong>Reject Accessories Request:</strong>{" "}
          {selectedCustomer?.customerId || "N/A"}{" "}
          {selectedCustomer?.customerId && (
            <VerifiedRoundedIcon
              sx={{
                color: "#092e6b",
                fontSize: "15px",
                ml: 1
              }}
            />
          )}
        </Typography>
        
        {selectedCustomer && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Customer:</strong>{" "}
              {`${selectedCustomer.firstName} ${selectedCustomer.middleName || ""} ${selectedCustomer.lastName}`}
            </Typography>
            {selectedItem && (
              <Typography variant="body1">
                <strong>Total Amount:</strong> ₹{selectedItem.totalAmount}
              </Typography>
            )}
          </Box>
        )}
        
        <Box sx={{ mt: 3 }}>
          <TextareaAutosize
            minRows={3}
            placeholder="Reason for rejection (required)"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            }
            label="I confirm the rejection of this Accessories request"
            sx={{ mt: 2 }}
          />
          
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={confirmReject} 
            variant="contained" 
            color="error"
            disabled={!isConfirmed || !rejectReason}
          >
            Confirm Rejection
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Main Component
const AccessoriesPending = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [accessoriesCustomers, setAccessoriesCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [accessoriesDetailsModalOpen, setAccessoriesDetailsModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch data from your backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/getOrdersWithCustomers");
        
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          // Filter customers with pending accessories requests
          const pendingCustomers = response.data.data.filter(customer => 
            customer.accessoriesRequests && 
            customer.accessoriesRequests.some(request => request.status === "Pending")
          );
          
          setAccessoriesCustomers(pendingCustomers);
        } else {
          throw new Error(response.data?.message || "Invalid data format");
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

  // Filter customers based on search query
  const getFilteredAccessoriesCustomers = () => {
    return accessoriesCustomers.filter(customer =>
      (customer.customerId?.toString().includes(searchQuery) ||
        customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };
  
  // Handle accessories details modal
  const handleAccessoriesDetailsClick = (request, customer) => {
    setSelectedOrder(request);
    setSelectedCustomer(customer);
    setAccessoriesDetailsModalOpen(true);
  };

  // Handle reject click
  const handleRejectClick = (customer, request) => {
    setSelectedCustomer(customer);
    setSelectedOrder(request);
    setRejectionModalOpen(true);
  };

  // Handle approve action for accessories
  const handleAccessoriesApprove = async (customer) => {
    try {
      setLoading(true);
      // Find the pending accessories request for this customer
      const pendingRequest = customer.accessoriesRequests?.find(
        req => req.status === "Pending"
      );
      
      if (!pendingRequest) {
        throw new Error("No pending accessories request found for this customer");
      }

      const response = await axios.put(
        `http://localhost:5000/api/accessoriesapproval/update-status/${customer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Accessories approved successfully!");
        setAccessoriesDetailsModalOpen(false);
        
        // Refresh the data
        const newResponse = await axios.get("http://localhost:5000/api/getOrdersWithCustomers");
        const pendingCustomers = newResponse.data.data.filter(customer => 
          customer.accessoriesRequests && 
          customer.accessoriesRequests.some(request => request.status === "Pending")
        );
        setAccessoriesCustomers(pendingCustomers);
      }
    } catch (err) {
      setError(`Failed to approve accessories: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm reject action for accessories
  const handleAccessoriesConfirmReject = async (customer, reason) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/accessoriesrejection/update-status/${customer.customerId}`,
        {
          status: "Rejected",
          accessorieReason: reason,
        }
      );

      if (response.status === 200) {
        alert("Accessories rejected successfully!");
        
        // Refresh the data
        const newResponse = await axios.get("http://localhost:5000/api/getOrdersWithCustomers");
        const pendingCustomers = newResponse.data.data.filter(customer => 
          customer.accessoriesRequests && 
          customer.accessoriesRequests.some(request => request.status === "Pending")
        );
        setAccessoriesCustomers(pendingCustomers);
      }
    } catch (err) {
      setError(`Failed to reject accessories: ${err.response?.data?.error || err.message}`);
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
        <CardGiftcardIcon sx={{ mr: 1 }} /> Accessories Requests - Pending
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
                    ?.filter(request => request.status === "Pending")
                    .map((request) => (
                      <AccessoriesMobileCard
                        key={`${customer.customerId}-${request.id}`}
                        customer={customer}
                        order={request}
                        handleDetailsClick={handleAccessoriesDetailsClick}
                        handleApprove={handleAccessoriesApprove}
                        handleReject={handleRejectClick}
                      />
                    ))
                )
              ) : (
                <Box sx={{ textAlign: "center", my: 4 }}>
                  <Typography>No pending accessories requests found.</Typography>
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
                        ?.filter(request => request.status === "Pending")
                        .map((request) => (
                          <AccessoriesTabletRow
                            key={`${customer.customerId}-${request.id}`}
                            customer={customer}
                            order={request}
                            handleDetailsClick={handleAccessoriesDetailsClick}
                            handleApprove={handleAccessoriesApprove}
                            handleReject={handleRejectClick}
                          />
                        ))
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                        No pending accessories requests found.
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
                        ?.filter(request => request.status === "Pending")
                        .map((request) => (
                          <AccessoriesDesktopRow
                            key={`${customer.customerId}-${request.id}`}
                            customer={customer}
                            order={request}
                            handleDetailsClick={handleAccessoriesDetailsClick}
                            handleApprove={handleAccessoriesApprove}
                            handleReject={handleRejectClick}
                          />
                        ))
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                        No pending accessories requests found.
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
        handleReject={handleRejectClick}
      />

      {/* Rejection Modal */}
      <RejectionModal
        open={rejectionModalOpen}
        handleClose={() => setRejectionModalOpen(false)}
        selectedCustomer={selectedCustomer}
        selectedItem={selectedOrder}
        handleConfirmReject={handleAccessoriesConfirmReject}
      />
    </Box>
  );
};

export default AccessoriesPending;