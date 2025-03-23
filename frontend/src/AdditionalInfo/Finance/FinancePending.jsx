import React, { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, InputAdornment, Typography, FormControl, InputLabel, 
  OutlinedInput, TextareaAutosize, Dialog, DialogTitle, DialogContent, 
  DialogActions, Checkbox, FormControlLabel, CircularProgress, Chip, Grid,
  useMediaQuery, IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const FinancePending = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [financeAmount, setFinanceAmount] = useState("");
  const [financeReason, setFinanceReason] = useState("");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/financeshow"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to load customer data.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleErrorIconClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleRefundConfirmation = async () => {
    if (!isConfirmed) {
      setError("Please confirm the finance approval.");
      return;
    }

    if (!financeAmount || isNaN(financeAmount) || financeAmount <= 0) {
      setError("Please enter a valid finance amount.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/finance/update-status/${selectedCustomer.customerId}`,
        {
          status: "Approval",
          financeAmount: parseFloat(financeAmount),
          financeReason,
        }
      );

      if (response.status === 200) {
        alert("Finance status updated successfully!");
        setShowModal(false);
        setFinanceAmount("");
        setFinanceReason("");
        setIsConfirmed(false);
        setError(null);
      }
    } catch (err) {
      setError(
        `Failed to update finance status: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setShowDocumentsModal(false);
    setIsConfirmed(false);
    setFinanceAmount("");
    setFinanceReason("");
    setError(null);
  };

  const handleDocumentsIconClick = (customer, loan) => {
    setSelectedCustomer(customer);
    setSelectedLoan(loan);
    setShowDocumentsModal(true);
  };

  const getDocumentDetails = (document_path) => {
    if (!document_path) return { customerId: null, fileName: null };

    const fullPath = document_path.replace(/\\/g, "/");
    const pathParts = fullPath.split("/");
    const customerId = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];

    return { customerId, fileName };
  };

  // Mobile card view for each customer
  const MobileCustomerCard = ({ customer }) => {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          borderLeft: '4px solid #071947',
          borderRadius: '4px'
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Customer ID:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">{customer.customerId}</Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2">Name:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              {customer.firstName} {customer.middleName} {customer.lastName}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2">Email:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">{customer.email}</Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2">Car Details:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              {customer.model} | {customer.version} | {customer.color}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2">Loans:</Typography>
            {customer.loans?.length > 0 ? (
              customer.loans.map((loan, loanIndex) => (
                <div key={loanIndex} style={{ marginBottom: '8px' }}>
                  <Typography variant="body2">
                    <strong>Loan ID:</strong> {loan.id} <br />
                    <strong>Amount:</strong> {loan.loan_amount} <br />
                    <strong>Interest Rate:</strong> {loan.interest_rate} <br />
                    <strong>Duration:</strong> {loan.loan_duration} <br />
                    <strong>EMI:</strong> {loan.calculated_emi}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2">No loans available</Typography>
            )}
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2">Status: <Chip 
              label={customer.loans?.[0]?.status || "N/A"} 
              color="warning" 
              size="small"
            />

            </Typography>
          </Grid>
          
          
          <Grid item xs={12} sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {customer.loans?.length > 0 && (
              <IconButton 
                size="small" 
                onClick={() => handleDocumentsIconClick(customer, customer.loans[0])}
                sx={{ mr: 1 }}
              >
                <DescriptionIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton 
              size="small" 
              onClick={() => handleErrorIconClick(customer)}
            >
              <ErrorOutlineIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography 
        variant="h6" 
        align="center" 
        sx={{ 
          color: "#071947", 
          mb: 3 
        }}
      >
        Car Finance Pending
      </Typography>

      {/* Search Bar */}
      <Grid container justifyContent={isMobile ? "center" : "flex-start"} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            label="Search Car Finance"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
      </Grid>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </div>
      )}

      {error && !loading && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <>
          {/* Mobile View */}
          {isMobile && (
            <div>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) =>
                  customer.loans?.some((loan) => loan.status === "Pending") ? (
                    <MobileCustomerCard key={index} customer={customer} />
                  ) : null
                )
              ) : (
                <Typography align="center">No records found.</Typography>
              )}
            </div>
          )}

          {/* Desktop/Tablet View */}
          {!isMobile && (
            <TableContainer component={Paper} style={{ overflowX: "auto" }}>
              <Table size={isTablet ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: isTablet ? "12px" : "14px", fontWeight: "bold" }}>
                      Customer ID
                    </TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "12px" : "14px", fontWeight: "bold" }}>
                      Full Name
                    </TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "12px" : "14px", fontWeight: "bold" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "12px" : "14px", fontWeight: "bold" }}>
                      Car Details
                    </TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "12px" : "14px", fontWeight: "bold" }}>
                      Loans
                    </TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "12px" : "14px", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "12px" : "14px", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer, index) =>
                      customer.loans?.some((loan) => loan.status === "Pending") ? (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: isTablet ? "12px" : "14px" }}>
                            {customer.customerId}
                          </TableCell>
                          <TableCell sx={{ fontSize: isTablet ? "12px" : "14px" }}>
                            {customer.firstName} {customer.middleName} {customer.lastName}
                          </TableCell>
                          <TableCell sx={{ fontSize: isTablet ? "12px" : "14px" }}>
                            {customer.email}
                          </TableCell>
                          <TableCell sx={{ fontSize: isTablet ? "12px" : "14px" }}>
                            {customer.model} | {customer.version} | {customer.color}
                          </TableCell>
                          <TableCell sx={{ fontSize: isTablet ? "12px" : "14px" }}>
                            {customer.loans?.length > 0
                              ? customer.loans.map((loan, loanIndex) => (
                                  <div key={loanIndex}>
                                    <strong>Loan ID:</strong> {loan.id} <br />
                                    <strong>Amount:</strong> {loan.loan_amount} <br />
                                    <strong>Interest Rate:</strong> {loan.interest_rate} <br />
                                    <strong>Duration:</strong> {loan.loan_duration} <br />
                                    <strong>EMI:</strong> {loan.calculated_emi} <br />
                                  </div>
                                ))
                              : "No loans available"}
                          </TableCell>
                          <TableCell sx={{ fontSize: isTablet ? "12px" : "14px" }}>
                            <Chip 
                              label={customer.loans?.[0]?.status || "N/A"} 
                              color="warning" 
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: isTablet ? "12px" : "14px" }}>
                            {customer.loans?.length > 0
                              ? customer.loans.map((loan, loanIndex) => (
                                  <IconButton
                                    key={loanIndex}
                                    size="small"
                                    onClick={() => handleDocumentsIconClick(customer, loan)}
                                    sx={{ mr: 1 }}
                                  >
                                    <DescriptionIcon fontSize="small" />
                                  </IconButton>
                                ))
                              : null}
                            <IconButton
                              size="small"
                              onClick={() => handleErrorIconClick(customer)}
                            >
                              <ErrorOutlineIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ) : null
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
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

      {/* Finance Approval Dialog */}
      <Dialog
        open={showModal}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Finance Amount for: {selectedCustomer?.customerId || "N/A"}{" "}
              {selectedCustomer?.customerId && (
                <VerifiedRoundedIcon
                  style={{
                    color: "#092e6b",
                    fontSize: "15px",
                    verticalAlign: "middle"
                  }}
                />
              )}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCustomer && (
            <Typography gutterBottom>
              <strong>Full Name:</strong>{" "}
              {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
            </Typography>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  label="Amount"
                  type="number"
                  value={financeAmount}
                  onChange={(e) => setFinanceAmount(e.target.value)}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextareaAutosize
                minRows={3}
                placeholder="Reason for finance approval (optional)"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                }}
                value={financeReason}
                onChange={(e) => setFinanceReason(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    name="confirmCheckbox"
                  />
                }
                label="I confirm the finance approval"
              />
            </Grid>
          </Grid>
          
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button 
            onClick={handleRefundConfirmation} 
            color="primary" 
            disabled={!isConfirmed}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Finance Documents Dialog */}
      <Dialog
        open={showDocumentsModal}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Finance Documents for: {selectedCustomer?.customerId || "N/A"}{" "}
              {selectedCustomer?.customerId && (
                <VerifiedRoundedIcon
                  style={{
                    color: "#092e6b",
                    fontSize: "15px",
                    verticalAlign: "middle"
                  }}
                />
              )}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCustomer && (
            <Typography gutterBottom>
              <strong>Full Name:</strong>{" "}
              {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
            </Typography>
          )}
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Document Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>View Document</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Uploaded At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedLoan?.documents?.length > 0 ? (
                  selectedLoan.documents.map((document, index) => {
                    const { customerId, fileName } = getDocumentDetails(
                      document.document_path
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>{document.document_name}</TableCell>
                        <TableCell>
                          {fileName ? (
                            <a
                              href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(
                                fileName
                              )}`}
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
                        <TableCell>
                          {new Date(document.uploaded_at).toLocaleString()}
                        </TableCell>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinancePending;