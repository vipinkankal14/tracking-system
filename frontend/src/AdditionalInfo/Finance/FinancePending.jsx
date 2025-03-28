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
  List,
  ListItem,
  ListItemText,
 } from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Description as DescriptionIcon,
  VerifiedRounded as VerifiedRoundedIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@mui/icons-material";

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';


// Mobile Card Row Component for Finance
const FinanceMobileCard = ({ customer, handleDetailsClick, handleApprove, handleReject }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const loan = customer.loans && customer.loans.length > 0 ? customer.loans[0] : null;

  return (
    <Card sx={{ mb: 2, border: `1px solid #f57c00` }}> {/* Pending status color */}
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {customer.customerId}
          </Typography>
          <Chip 
            label="Pending" 
            size="small" 
            sx={{ 
              backgroundColor: "#f57c00",
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
            onClick={() => handleDetailsClick(customer, loan)}
          >
            Documents
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
              <strong>Car Details:</strong> {customer.model || "N/A"} | {customer.version || "N/A"} | {customer.color || "N/A"}
            </Typography>
            {loan && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Loan ID:</strong> {loan.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Amount:</strong> {loan.loan_amount}
                </Typography>
                <Typography variant="body2">
                  <strong>Interest Rate:</strong> {loan.interest_rate}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {loan.loan_duration}
                </Typography>
                <Typography variant="body2">
                  <strong>EMI:</strong> {loan.calculated_emi}
                </Typography>
              </>
            )}
            
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
                onClick={() => handleReject(customer)}
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

// Tablet Row Component for Finance
const FinanceTabletRow = ({ customer, handleDetailsClick, handleApprove, handleReject }) => {
  const [open, setOpen] = useState(false);
  const loan = customer.loans && customer.loans.length > 0 ? customer.loans[0] : null;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.customerId}</TableCell>
        <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
        <TableCell>{loan?.loan_amount || "N/A"}</TableCell>
        <TableCell>
          <Chip 
            label="Pending" 
            size="small" 
            sx={{ 
              backgroundColor: "#f57c00",
              color: "white"
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => handleDetailsClick(customer, loan)}
          >
            <DescriptionIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Loan Details
              </Typography>
              {loan && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Email:</strong> {customer.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Car Details:</strong> {customer.model || "N/A"} | {customer.version || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Interest Rate:</strong> {loan.interest_rate}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {loan.loan_duration}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>EMI:</strong> {loan.calculated_emi}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              
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
                  onClick={() => handleReject(customer)}
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

// Desktop Row Component for Finance
const FinanceDesktopRow = ({ customer, handleDetailsClick, handleApprove, handleReject }) => {
  const [open, setOpen] = useState(false);
  const loan = customer.loans && customer.loans.length > 0 ? customer.loans[0] : null;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{customer.customerId}</TableCell>
        <TableCell>{`${customer.firstName} ${customer.middleName || ""} ${customer.lastName}`}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{customer.model || "N/A"} | {customer.version || "N/A"} | {customer.color || "N/A"}</TableCell>
        <TableCell>{loan?.loan_amount || "N/A"}</TableCell>
        <TableCell>
          <Chip 
            label="Pending" 
            size="small" 
            sx={{ 
              backgroundColor: "#f57c00",
              color: "white"
            }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleDetailsClick(customer, loan)}
              title="View Documents"
            >
              <DescriptionIcon />
            </IconButton>
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
              onClick={() => handleReject(customer)}
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
                Loan Details
              </Typography>
              {loan && (
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      <strong>Loan ID:</strong> {loan.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      <strong>Interest Rate:</strong> {loan.interest_rate}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {loan.loan_duration}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      <strong>EMI:</strong> {loan.calculated_emi}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Finance Documents Modal
const FinanceDocumentsModal = ({ open, handleClose, selectedCustomer, selectedLoan, handleApprove, handleReject }) => {
  const getDocumentDetails = (document_path) => {
    if (!document_path) return { customerId: null, fileName: null };

    const fullPath = document_path.replace(/\\/g, "/");
    const pathParts = fullPath.split("/");
    const customerId = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];

    return { customerId, fileName };
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="finance-documents-modal-title"
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
        <Typography id="finance-documents-modal-title" variant="h6" component="h2">
          Finance Documents
        </Typography>
        
        {selectedCustomer && selectedLoan && (
          <>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Customer ID:</strong> {selectedCustomer.customerId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Status:</strong>{" "}
                    <Chip 
                      label="Pending" 
                      size="small" 
                      sx={{ 
                        backgroundColor: "#f57c00",
                        color: "white"
                      }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Full Name:</strong>{" "}
                    {`${selectedCustomer.firstName} ${selectedCustomer.middleName || ""} ${selectedCustomer.lastName}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedCustomer.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Car Details:</strong>{" "}
                    {`${selectedCustomer.model || "N/A"} | ${selectedCustomer.version || "N/A"} | ${selectedCustomer.color || "N/A"}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Loan Amount:</strong> {selectedLoan.loan_amount}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Interest Rate:</strong> {selectedLoan.interest_rate}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Duration:</strong> {selectedLoan.loan_duration}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>EMI:</strong> {selectedLoan.calculated_emi}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Documents
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Name</TableCell>
                      <TableCell>View Document</TableCell>
                      <TableCell>Uploaded At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedLoan.documents && selectedLoan.documents.length > 0 ? (
                      selectedLoan.documents.map((document, index) => {
                        const { customerId, fileName } = getDocumentDetails(document.document_path);
                        return (
                          <TableRow key={index}>
                            <TableCell>{document.document_name}</TableCell>
                            <TableCell>
                              {fileName ? (
                                <a
                                  href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(fileName)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                  }}
                                >
                                  View Document
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell>{new Date(document.uploaded_at).toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No documents found.
                        </TableCell>
                      </TableRow>
                    )}
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
                onClick={() => handleReject(selectedCustomer)}
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
const RejectionModal = ({ open, handleClose, selectedCustomer, selectedLoan, handleConfirmReject }) => {
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
          <strong>Reject Finance Request:</strong>{" "}
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
            {selectedLoan && (
              <Typography variant="body1">
                <strong>Loan Amount:</strong>{" "}
                {selectedLoan.loan_amount}
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
            label="I confirm the rejection of this Finance request"
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
const FinancePending = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [searchQuery, setSearchQuery] = useState("");
  const [financeCustomers, setFinanceCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [financeDocumentsModalOpen, setFinanceDocumentsModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch finance data
        const financeResponse = await axios.get("http://localhost:5000/api/financeshow");
        if (financeResponse.data && Array.isArray(financeResponse.data.data)) {
          setFinanceCustomers(financeResponse.data.data);
        } else {
          throw new Error("Invalid finance data format");
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

  // Filter customers based on search query and status (only Pending)
  const getFilteredFinanceCustomers = () => {
    return financeCustomers.filter(
      (customer) => 
        (customer.customerId?.toString().includes(searchQuery) ||
         customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        customer.loans?.some(loan => loan.status === "Pending")
    );
  };

  // Handle finance documents modal
  const handleFinanceDocumentsClick = (customer, loan) => {
    setSelectedCustomer(customer);
    setSelectedLoan(loan);
    setFinanceDocumentsModalOpen(true);
  };

        // Handle reject click
  const handleRejectClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedLoan(customer.loans[0]);
    setRejectionModalOpen(true);
  };

  // Handle approve action for finance
  const handleFinanceApprove = async (customer) => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `http://localhost:5000/api/finance/update-status/${customer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Finance approved successfully!");
        
        // Close any open modals
        setFinanceDocumentsModalOpen(false);
        
        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/financeshow");
        setFinanceCustomers(newData.data.data);
        
        setLoading(false);
      }
    } catch (err) {
      setError(`Failed to approve finance: ${err.response?.data?.error || err.message}`);
      setLoading(false);
    }
  };

  // Handle confirm reject action for finance
  const handleFinanceConfirmReject = async (customer, reason) => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `http://localhost:5000/api/finance/update-status/${customer.customerId}`,
        {
          status: "Rejected",
          reason: reason
        }
      );

      if (response.status === 200) {
        alert("Finance rejected successfully!");
        
        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/financeshow");
        setFinanceCustomers(newData.data.data);
        
        setLoading(false);
      }
    } catch (err) {
      setError(`Failed to reject finance: ${err.response?.data?.error || err.message}`);
      setLoading(false);
    }
  };

  // Close modals
  const handleCloseModals = () => {
    setFinanceDocumentsModalOpen(false);
    setRejectionModalOpen(false);
    setSelectedCustomer(null);
    setSelectedLoan(null);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#071947", display: 'flex', alignItems: 'center' }}>
        <AccountBalanceIcon sx={{ mr: 1 }} /> Pending Finance Requests
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
          sx={{ width: { xs: '100%', sm: '350px' } }}
        />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', color: 'error.main', my: 4 }}>
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <>
          {/* Mobile View - Card Layout */}
          {isMobile && (
            <Box>
              {getFilteredFinanceCustomers().length > 0 ? (
                getFilteredFinanceCustomers().map((customer) => (
                  <FinanceMobileCard 
                    key={customer.customerId}
                    customer={customer}
                    handleDetailsClick={handleFinanceDocumentsClick}
                    handleApprove={handleFinanceApprove}
                    handleReject={() => handleRejectClick(customer)}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                  <Typography>No pending finance requests found.</Typography>
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
                  {getFilteredFinanceCustomers().length > 0 ? (
                    getFilteredFinanceCustomers().map((customer) => (
                      customer.loans.filter(loan => loan.status === "Pending").map((loan) => (
                        <FinanceTabletRow 
                          key={`${customer.customerId}-${loan.id}`}
                          customer={customer}
                          handleDetailsClick={handleFinanceDocumentsClick}
                          handleApprove={handleFinanceApprove}
                          handleReject={() => handleRejectClick(customer)}
                        />
                      ))
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                        No pending finance requests found.
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
                    <TableCell>Loan Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredFinanceCustomers().length > 0 ? (
                    getFilteredFinanceCustomers().map((customer) => (
                      customer.loans.filter(loan => loan.status === "Pending").map((loan) => (
                        <FinanceDesktopRow 
                          key={`${customer.customerId}-${loan.id}`}
                          customer={customer}
                          handleDetailsClick={handleFinanceDocumentsClick}
                          handleApprove={handleFinanceApprove}
                          handleReject={() => handleRejectClick(customer)}
                        />
                      ))
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                        No pending finance requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
      
      {/* Finance Documents Modal */}
      <FinanceDocumentsModal 
        open={financeDocumentsModalOpen}
        handleClose={handleCloseModals}
        selectedCustomer={selectedCustomer}
        selectedLoan={selectedLoan}
        handleApprove={handleFinanceApprove}
        handleReject={() => handleRejectClick(selectedCustomer)}
      />
      
      {/* Rejection Modal */}
      <RejectionModal 
        open={rejectionModalOpen}
        handleClose={handleCloseModals}
        selectedCustomer={selectedCustomer}
        selectedLoan={selectedLoan}
        handleConfirmReject={handleFinanceConfirmReject}
      />
    </Box>
  );
};

export default FinancePending;