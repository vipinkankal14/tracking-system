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
  Description ,
  VerifiedRounded as VerifiedRoundedIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { color } from "framer-motion";

// Mobile Card Row Component
const MobileCardRow = ({
  customer,
  handleDetailsClick,
  handleApprove,
 }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getStatusColor = () => "#f57c00"; // Always pending

  return (
    <Card sx={{ mb: 2, border: `1px solid ${getStatusColor()}` }}>
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

          {/* Status Chip */}
          {customer.coatingRequests[0]?.status && (
            <Chip
              label={customer.coatingRequests[0].status}
              size="small"
              color="error"
            />
          )}

           
        </Box>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {`${customer.firstName} ${customer.middleName || ""} ${
            customer.lastName
          }`}
        </Typography>

     <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
               <Typography>
                 {customer.mobileNumber1 ? (
                   // If mobileNumber1 exists
                   <>
                     <strong sx={{ mt: 1 }}>Number : {customer.mobileNumber1}</strong>
                     {customer.mobileNumber2 && ", "}{" "}
                     {/* Add comma if both numbers exist */}
                   </>
                 ) : null}
     
                 {customer.mobileNumber2 && (
                   // Only show mobileNumber2 if it exists
                   <strong sx={{ mt: 1 }}>{customer.mobileNumber2}</strong>
                 )}
               </Typography>
     
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

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Car Details:</strong>{" "}
                  {customer.carBooking?.model || "N/A"} |{" "}
                  {customer.carBooking?.version || "N/A"} |{" "}
                  {customer.carBooking?.color || "N/A"}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>VIN Number:</strong>{" "}
                  {customer.stockInfo?.model || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Chassis Number:</strong>{" "}
                  {customer.stockInfo?.chassisNumber || "N/A"}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Engine Number:</strong>{" "}
                  {customer.stockInfo?.engineNumber || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Coating Type:</strong>{" "}
                  {customer.coatingRequests[0]?.coatingType || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Durability Coating:</strong>{" "}
                  {customer.coatingRequests[0]?.durability || "N/A"}
                </Typography>

                <Typography variant="body2">
                  <strong>Preferred Date:</strong>{" "}
                  {customer.coatingRequests[0]?.preferredDate
                    ? new Date(
                        customer.coatingRequests[0].preferredDate
                      ).toLocaleDateString()
                    : "N/A"}
                </Typography>

                <Typography variant="body2">
                  <strong>Preferred Time:</strong>{" "}
                  {customer.coatingRequests[0]?.preferredTime || "N/A"}
                </Typography>

                <Typography variant="body2">
                  <strong>Additional Notes:</strong>{" "}
                  {customer.coatingRequests[0]?.additionalNotes || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Created At:</strong>{" "}
                  {customer.coatingRequests[0]?.createdAt
                    ? new Date(
                        customer.coatingRequests[0].createdAt
                      ).toLocaleString()
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Updated At:</strong>{" "}
                  {customer.coatingRequests[0]?.updatedAt
                    ? new Date(
                        customer.coatingRequests[0].updatedAt
                      ).toLocaleString()
                    : "N/A"}
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
const TabletRow = ({
  customer,
  handleDetailsClick,
  handleApprove,
}) => {
  const [open, setOpen] = useState(false);

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
              <TableCell>
                  {customer.carBooking?.model || "N/A"} |{" "}
                  {customer.carBooking?.version || "N/A"} |{" "}
                  {customer.carBooking?.color || "N/A"}
                </TableCell>
                <TableCell>
                  {customer.coatingRequests[0]?.coating_amount || "N/A"}
                </TableCell>
        <TableCell>
          {customer.coatingRequests[0]?.status && (
            <Chip
              label={customer.coatingRequests[0].status}
              size="small"
              color="error"
            />
          )}
        </TableCell>
 
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}> 
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}></Box>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Car Details:</strong>{" "}
                                {customer.carBooking?.model || "N/A"} |{" "}
                                {customer.carBooking?.version || "N/A"} |{" "}
                                {customer.carBooking?.color || "N/A"}
                              </Typography>
            
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>VIN Number:</strong>{" "}
                                {customer.stockInfo?.model || "N/A"}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Chassis Number:</strong>{" "}
                                {customer.stockInfo?.chassisNumber || "N/A"}
                              </Typography>
            
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Engine Number:</strong>{" "}
                                {customer.stockInfo?.engineNumber || "N/A"}
                              </Typography>
                            </Grid>
            
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Coating Type:</strong>{" "}
                                {customer.coatingRequests[0]?.coatingType || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Durability Coating:</strong>{" "}
                                {customer.coatingRequests[0]?.durability || "N/A"}
                              </Typography>
            
                              <Typography variant="body2">
                                <strong>Preferred Date:</strong>{" "}
                                {customer.coatingRequests[0]?.preferredDate
                                  ? new Date(
                                      customer.coatingRequests[0].preferredDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </Typography>
            
                              <Typography variant="body2">
                                <strong>Preferred Time:</strong>{" "}
                                {customer.coatingRequests[0]?.preferredTime || "N/A"}
                              </Typography>
            
                              <Typography variant="body2">
                                <strong>Additional Notes:</strong>{" "}
                                {customer.coatingRequests[0]?.additionalNotes || "N/A"}
                              </Typography>
                            </Grid>
            
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Created At:</strong>{" "}
                                {customer.coatingRequests[0]?.createdAt
                                  ? new Date(
                                      customer.coatingRequests[0].createdAt
                                    ).toLocaleString()
                                  : "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Updated At:</strong>{" "}
                                {customer.coatingRequests[0]?.updatedAt
                                  ? new Date(
                                      customer.coatingRequests[0].updatedAt
                                    ).toLocaleString()
                                  : "N/A"}
                              </Typography>
                            </Grid>
                          </Grid>

            <Box sx={{ mt: 2, mb: 2, display: "flex", gap: 1 }}>
              
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => handleApprove(customer)}
              >
                Approve
              </Button>
              
            </Box>
              
            
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Desktop Row Component
const DesktopRow = ({
  customer,
  handleDetailsClick,
  handleApprove,
 }) => {
  const [open, setOpen] = useState(false);

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
        <TableCell>
          {customer.coatingRequests[0]?.coating_amount || "N/A"}
        </TableCell>
        <TableCell>
    
           
          {
            customer.coatingRequests[0]?.status && (
              <Chip
                label={customer.coatingRequests[0].status}
                size="small"
                color="error"
              />
            )

          }
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
        
            
            <Box sx={{ display: "flex", gap: 1 ,alignItems: "center",justifyContent: "center",size:"small"}}>
              
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
                             <Grid item xs={6}>
                               <Typography variant="body2" sx={{ mt: 1 }}>
                                 <strong>Car Details:</strong>{" "}
                                 {customer.carBooking?.model || "N/A"} |{" "}
                                 {customer.carBooking?.version || "N/A"} |{" "}
                                 {customer.carBooking?.color || "N/A"}
                               </Typography>
             
                               <Typography variant="body2" sx={{ mt: 1 }}>
                                 <strong>VIN Number:</strong>{" "}
                                 {customer.stockInfo?.model || "N/A"}
                               </Typography>
                               <Typography variant="body2" sx={{ mt: 1 }}>
                                 <strong>Chassis Number:</strong>{" "}
                                 {customer.stockInfo?.chassisNumber || "N/A"}
                               </Typography>
             
                               <Typography variant="body2" sx={{ mt: 1 }}>
                                 <strong>Engine Number:</strong>{" "}
                                 {customer.stockInfo?.engineNumber || "N/A"}
                               </Typography>
                             </Grid>
             
                             <Grid item xs={6}>
                               <Typography variant="body2">
                                 <strong>Coating Type:</strong>{" "}
                                 {customer.coatingRequests[0]?.coatingType || "N/A"}
                               </Typography>
                               <Typography variant="body2">
                                 <strong>Durability Coating:</strong>{" "}
                                 {customer.coatingRequests[0]?.durability || "N/A"}
                               </Typography>
             
                               <Typography variant="body2">
                                 <strong>Preferred Date:</strong>{" "}
                                 {customer.coatingRequests[0]?.preferredDate
                                   ? new Date(
                                       customer.coatingRequests[0].preferredDate
                                     ).toLocaleDateString()
                                   : "N/A"}
                               </Typography>
             
                               <Typography variant="body2">
                                 <strong>Preferred Time:</strong>{" "}
                                 {customer.coatingRequests[0]?.preferredTime || "N/A"}
                               </Typography>
             
                               <Typography variant="body2">
                                 <strong>Additional Notes:</strong>{" "}
                                 {customer.coatingRequests[0]?.additionalNotes || "N/A"}
                               </Typography>
                             </Grid>
             
                             <Grid item xs={6}>
                               <Typography variant="body2">
                                 <strong>Created At:</strong>{" "}
                                 {customer.coatingRequests[0]?.createdAt
                                   ? new Date(
                                       customer.coatingRequests[0].createdAt
                                     ).toLocaleString()
                                   : "N/A"}
                               </Typography>
                             </Grid>
                             <Grid item xs={6}>
                               <Typography variant="body2">
                                 <strong>Updated At:</strong>{" "}
                                 {customer.coatingRequests[0]?.updatedAt
                                   ? new Date(
                                       customer.coatingRequests[0].updatedAt
                                     ).toLocaleString()
                                   : "N/A"}
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

 

// Main Component
const CoatingRejected = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
   const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCoating, setSelectedCoating] = useState(null);

  // Fetch customers with coating data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/showCoating"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to load coating data.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on search query and tab
  const getFilteredCustomers = () => {
    return customers.filter(
      (customer) =>
        customer.coatingRequests[0]?.status === "Rejected" &&
        (customer.customerId
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          customer.firstName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.lastName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredCustomers = getFilteredCustomers();

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle details modal
  const handleDetailsClick = (customer, coating) => {
    setSelectedCustomer(customer);
    setSelectedCoating(coating);
   };

 

  // Handle approve action
  const handleApprove = async (customer) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/coatingapproval/update-status/${customer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Coating approved successfully!");
        // Close any open modals
         setRejectionModalOpen(false);

        // Refresh the data
        const newData = await axios.get(
          "http://localhost:5000/api/showCoating"
        );
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to approve coating: ${err.response?.data?.error || err.message}`
      );
    }
  };

 

  // Get current tab status
  const getCurrentStatus = () => {
    switch (tabValue) {
      case 0:
        return "pending";
      case 1:
        return "approved";
      case 2:
        return "rejected";
      default:
        return "pending";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#071947" }}>
        Coating Management - Rejected
      </Typography>

      <Grid
        container
        justifyContent={isMobile ? "center" : "flex-start"}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by ID, name, or email..."
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
          />
        </Grid>
      </Grid>

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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <MobileCardRow
                    key={customer.customerId}
                    customer={customer}
                    handleDetailsClick={handleDetailsClick}
                    handleApprove={handleApprove}
                     status={getCurrentStatus()}
                  />
                ))
              ) : (
                <Typography sx={{ textAlign: "center", my: 4 }}>
                  No records found.
                </Typography>
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
                             <TableCell>Car Details</TableCell>
                                            <TableCell>Coating Amount</TableCell>
                    <TableCell>Status</TableCell>
                 
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TabletRow
                        key={customer.customerId}
                        customer={customer}
                        handleDetailsClick={handleDetailsClick}
                        handleApprove={handleApprove}
                         status={getCurrentStatus()}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                        No records found.
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
                    <TableCell>Coating Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <DesktopRow
                        key={customer.customerId}
                        customer={customer}
                        handleDetailsClick={handleDetailsClick}
                        handleApprove={handleApprove}
                         status={getCurrentStatus()}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

 

 
    </div>
  );
};

export default CoatingRejected;
