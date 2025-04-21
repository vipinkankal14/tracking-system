import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Collapse,
  IconButton,
  Chip,
  Grid,
  Box,
  CircularProgress,
  Divider,
  Alert,
  Button,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ExchangePending = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [carExchanges, setCarExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [exchangeReason, setExchangeReason] = useState("");
  
  // Expandable row states
  const [expandedRows, setExpandedRows] = useState({});

  // Fetch car exchanges data
  useEffect(() => {
    const fetchCarExchanges = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showexchange");
        
        if (response.data && Array.isArray(response.data.data)) {
          // Filter only pending exchanges
          const pendingExchanges = response.data.data.filter(
            exchange => exchange.status === "Pending"
          );
          setCarExchanges(pendingExchanges);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to load car exchange data.");
        console.error("Error fetching car exchanges:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarExchanges();
  }, []);

  // Filter exchanges based on search query
  const filteredExchanges = carExchanges.filter(
    (exchange) =>
      exchange.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchange.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchange.carMake?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle approve button click
  const handleApproveClick = (exchange) => {
    setSelectedExchange(exchange);
    setExchangeAmount(exchange.exchangeAmount?.toString() || "");
    setExchangeReason(exchange.exchangeReason || "");
    setShowApproveModal(true);
  };

  // Handle reject button click
  const handleRejectClick = (exchange) => {
    setSelectedExchange(exchange);
    setExchangeReason(exchange.exchangeReason || "");
    setShowRejectModal(true);
  };

  // Handle documents button click
  const handleDocumentsClick = (exchange) => {
    setSelectedExchange(exchange);
    setShowDocumentsModal(true);
  };

  // Handle approve confirmation
  const handleApproveConfirmation = async () => {
    if (!isConfirmed) {
      setError("Please confirm the approval.");
      return;
    }

    if (!exchangeAmount || isNaN(Number(exchangeAmount))) {
      setError("Please enter a valid exchange amount.");
      return;
    }

    try {
      const endpoint = `http://localhost:5000/api/exchange/update-status/${selectedExchange?.customerId}`;
      const status = "Approval";
      const payload = { 
        status, 
        exchangeAmount: parseFloat(exchangeAmount), 
        exchangeReason 
      };

      const response = await axios.put(endpoint, payload);

      if (response.status === 200) {
        // Update the local state to remove the approved exchange
        setCarExchanges(carExchanges.filter(
          exchange => exchange.customerId !== selectedExchange?.customerId
        ));
        
        // Reset and close modal
        handleCloseModal();
        alert("Exchange approved successfully!");
      }
    } catch (err) {
      setError(
        `Failed to approve exchange: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  // Handle reject confirmation
  const handleRejectConfirmation = async () => {
    if (!isConfirmed) {
      setError("Please confirm the rejection.");
      return;
    }

    if (!exchangeReason) {
      setError("Please enter a reason for rejection.");
      return;
    }

    try {
      const endpoint = `http://localhost:5000/api/exchange/update-status/${selectedExchange?.customerId}`;
      const status = "Rejected";
      const payload = { 
        status, 
        exchangeReason 
      };

      const response = await axios.put(endpoint, payload);

      if (response.status === 200) {
        // Update the local state to remove the rejected exchange
        setCarExchanges(carExchanges.filter(
          exchange => exchange.customerId !== selectedExchange?.customerId
        ));
        
        // Reset and close modal
        handleCloseModal();
        alert("Exchange rejected successfully!");
      }
    } catch (err) {
      setError(
        `Failed to reject exchange: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
    setShowDocumentsModal(false);
    setIsConfirmed(false);
    setExchangeAmount("");
    setExchangeReason("");
    setError(null);
  };

  // Extract document details from path
  const getDocumentDetails = (documentPath) => {
    if (!documentPath) return { customerId: null, fileName: null };

    const fullPath = documentPath.replace(/\\/g, "/");
    const pathParts = fullPath.split("/");
    const customerId = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];

    return { customerId, fileName };
  };

  // Get full name from exchange object
  const getFullName = (exchange) => {
    return `${exchange.firstName}${exchange.middleName ? ` ${exchange.middleName}` : ''} ${exchange.lastName}`;
  };

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    setExpandedRows({
      ...expandedRows,
      [id]: !expandedRows[id]
    });
  };

  // Get status chip color based on status
  const getStatusColor = (status) => {
    return "warning"; // All will be pending in this version
  };

  // Mobile view - Card based layout
  const renderMobileView = () => {
    return (
      <Box sx={{ mt: 2 }}>
        {filteredExchanges.length > 0 ? (
          filteredExchanges.map((exchange, index) => (
            <Card key={index} sx={{ mb: 2, borderRadius: 2 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">ID: {exchange.customerId}</Typography>
                    <Chip 
                      label={exchange.status} 
                      color={getStatusColor(exchange.status)} 
                      size="small"
                    />
                  </Box>
                }
                action={
                  <IconButton
                    onClick={() => toggleRowExpand(exchange.customerId)}
                    aria-expanded={expandedRows[exchange.customerId]}
                    aria-label="show more"
                  >
                    {expandedRows[exchange.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ pt: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {getFullName(exchange)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exchange.carMake} | {exchange.carModel}
                </Typography>
                
                <Collapse in={expandedRows[exchange.customerId]} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Ex-Car Owner:</strong> {exchange.carOwnerFullName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Car Details Exchanges :</strong> {exchange.carMake} | {exchange.carModel} | {exchange.carColor}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Registration:</strong> {exchange.carRegistration}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Year:</strong> {exchange.carYear}
                    </Typography>
                    {exchange.exchangeAmount && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Exchange Amount:</strong> ₹{exchange.exchangeAmount}
                      </Typography>
                    )}
                    {exchange.exchangeReason && (
                      <Typography variant="body2" color="red" sx={{ mb: 1 }}>
                        <strong>Reason:</strong> {exchange.exchangeReason}
                      </Typography>
                    )}
                             <Typography variant="body2" sx={{ mb: 1 }}> 
                            <strong>Created At:</strong> {new Date(exchange.createdAt).toLocaleString()}
                      </Typography>
                     
                            <Typography variant="body2" sx={{ mb: 1 }}> 
                            <strong>Updated At:</strong> {new Date(exchange.updatedAt).toLocaleString()}
                              </Typography>
                           
                   
                  </Box>
                </Collapse>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <Button 
                  size="small" 
                  startIcon={<DescriptionIcon />}
                  onClick={() => handleDocumentsClick(exchange)}
                >
                  Docs
                </Button>
                <Button 
                  size="small" 
                  startIcon={<ErrorOutlineIcon />}
                  onClick={() => handleRejectClick(exchange)}
                  color="error"
                >
                  Reject
                </Button>
                <Button 
                  size="small" 
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={() => handleApproveClick(exchange)}
                  color="success"
                >
                  Approve
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">No pending exchanges found.</Typography>
          </Card>
        )}
      </Box>
    );
  };

  // Tablet view - Simplified table
  const renderTabletView = () => {
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Car Details Exchanges</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExchanges.length > 0 ? (
              filteredExchanges.map((exchange, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpand(exchange.customerId)}
                        aria-expanded={expandedRows[exchange.customerId]}
                        aria-label="expand row"
                      >
                        {expandedRows[exchange.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {exchange.customerId}
                    </TableCell>
                    <TableCell>{getFullName(exchange)}</TableCell>
                    <TableCell>{exchange.carMake} | {exchange.carModel}</TableCell>
                    <TableCell>
                      <Chip 
                        label={exchange.status} 
                        color={getStatusColor(exchange.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleDocumentsClick(exchange)}
                        sx={{ mr: 1 }}
                      >
                        <DescriptionIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRejectClick(exchange)}
                        color="error"
                      >
                        <ErrorOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleApproveClick(exchange)}
                        color="success"
                      >
                        <CheckCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedRows[exchange.customerId]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, py: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Ex-Car Owner:</strong> {exchange.carOwnerFullName}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Car Color:</strong> {exchange.carColor}
                              </Typography>
                            </Grid>
                            
                            
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Registration:</strong> {exchange.carRegistration}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Year:</strong> {exchange.carYear}
                              </Typography>
                            </Grid>

                            <Grid item xs={6}>
                            <Typography variant="body2" sx={{ mb: 1 }}> 
                            <strong>Created At:</strong> {new Date(exchange.createdAt).toLocaleString()}
                            </Typography>
                            </Grid>
                              <Grid item xs={6}>
                            <Typography variant="body2" sx={{ mb: 1 }}> 
                            <strong>Updated At:</strong> {new Date(exchange.updatedAt).toLocaleString()}
                              </Typography>
                            </Grid>
                            
                            {exchange.exchangeAmount && (
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Exchange Amount:</strong> ₹{exchange.exchangeAmount}
                                </Typography>
                              </Grid>
                            )}
                            {exchange.exchangeReason && (
                              <Grid item xs={12}>
                                <Typography variant="body2" color="red">
                                  <strong>Reason:</strong> {exchange.exchangeReason}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No pending exchanges found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Desktop view - Full table
  const renderDesktopView = () => {
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Ex-Car Owner</TableCell>
              <TableCell>Car Details Exchanges</TableCell>
              <TableCell>Registration</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExchanges.length > 0 ? (
              filteredExchanges.map((exchange, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpand(exchange.customerId)}
                        aria-expanded={expandedRows[exchange.customerId]}
                        aria-label="expand row"
                      >
                        {expandedRows[exchange.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {exchange.customerId}
                    </TableCell>
                    <TableCell>{getFullName(exchange)}</TableCell>
                    <TableCell>{exchange.carOwnerFullName}</TableCell>
                    <TableCell>
                      {exchange.carMake} | {exchange.carModel} | {exchange.carColor}
                    </TableCell>
                    <TableCell>{exchange.carRegistration}</TableCell>
                    <TableCell>{exchange.carYear}</TableCell>
                    <TableCell>
                      <Chip 
                        label={exchange.status} 
                        color={getStatusColor(exchange.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleDocumentsClick(exchange)}
                        sx={{ mr: 1 }}
                      >
                        <DescriptionIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRejectClick(exchange)}
                        color="error"
                      >
                        <ErrorOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleApproveClick(exchange)}
                        color="success"
                      >
                        <CheckCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                      <Collapse in={expandedRows[exchange.customerId]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, py: 2 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Additional Details
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" gutterBottom>
                                <strong>Contact Information:</strong>
                              </Typography>
                              <Typography variant="body2">
                                Email: {exchange.email || 'N/A'}
                              </Typography>
                              <Typography variant="body2">
                                Phone: {exchange.mobileNumber1 || 'N/A'} , {exchange.mobileNumber2 || 'N/A'}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>

                            <Typography variant="body2" sx={{ mb: 1 }}> 
                  <strong>Created At:</strong> {new Date(exchange.createdAt).toLocaleString()}
                            </Typography>
                            
                <Typography variant="body2" sx={{ mb: 1 }}> 
                  <strong>Updated At:</strong> {new Date(exchange.updatedAt).toLocaleString()}
                              </Typography>
                              </Grid>

                            <Grid item xs={12} md={12}>
                              <Typography variant="body2" gutterBottom>
                                <strong>Exchange Information:</strong>
                              </Typography>
                              {exchange.exchangeAmount && (
                                <Typography variant="body2">
                                  Exchange Amount: ₹{exchange.exchangeAmount}
                                </Typography>
                              )}
                              {exchange.exchangeReason && (
                                <Typography variant="body2" color="red">
                                  Reason: {exchange.exchangeReason}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No pending exchanges found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}> 
      
      <Typography variant="h5" gutterBottom align="center" sx={{ color: "#071947" }}>
        Pending Car Exchanges
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          label="Search Pending Exchanges"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '100%', maxWidth: '400px' }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error && !showApproveModal && !showRejectModal && !showDocumentsModal ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <>
          {isMobile && renderMobileView()}
          {isTablet && renderTabletView()}
          {isDesktop && renderDesktopView()}
        </>
      )}

      {/* Approve Exchange Modal */}
      <Dialog 
        open={showApproveModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              <strong>Approve Exchange for:</strong> {selectedExchange?.customerId || "N/A"}
              {selectedExchange?.customerId && (
                <VerifiedRoundedIcon
                  sx={{
                    color: "#092e6b",
                    fontSize: 15,
                    mt: -0.3,
                    mr: -0.4,
                  }}
                />
              )}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            {selectedExchange && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Full Name:</strong>{" "}
                  {`${selectedExchange.firstName} ${selectedExchange.middleName || ''} ${selectedExchange.lastName}`}
                </Typography>

                {selectedExchange.exchangeAmount && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Current Exchange Amount:</strong> ₹
                    {selectedExchange.exchangeAmount}
                  </Typography>
                )}
                
                {selectedExchange.exchangeReason && (
                  <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
                    <strong>Current Reason:</strong>{" "}
                    {selectedExchange.exchangeReason}
                  </Typography>
                )}

          
              </>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Amount Input */}
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                label="Amount"
                type="number"
                value={exchangeAmount}
                onChange={(e) => setExchangeAmount(e.target.value)}
                required
              />
            </FormControl>

            {/* Exchange Reason Textarea */}
            <TextField
              label="Reason for approval (optional)"
              multiline
              rows={3}
              value={exchangeReason}
              onChange={(e) => setExchangeReason(e.target.value)}
              fullWidth
            />

            {/* Confirmation Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                />
              }
              label="I confirm the exchange approval"
            />
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button 
            onClick={handleApproveConfirmation} 
            disabled={!isConfirmed || !exchangeAmount}
            variant="contained"
            color="success"
          >
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Exchange Modal */}
      <Dialog 
        open={showRejectModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              <strong>Reject Exchange for:</strong> {selectedExchange?.customerId || "N/A"}
              {selectedExchange?.customerId && (
                <VerifiedRoundedIcon
                  sx={{
                    color: "#092e6b",
                    fontSize: 15,
                    mt: -0.3,
                    mr: -0.4,
                  }}
                />
              )}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers> 
          <Box sx={{ mb: 2 }}> 
            {selectedExchange && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Full Name:</strong>{" "}
                  {`${selectedExchange.firstName} ${selectedExchange.middleName || ''} ${selectedExchange.lastName}`}
                </Typography>

                {selectedExchange.exchangeAmount && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Current Exchange Amount:</strong> ₹
                    {selectedExchange.exchangeAmount}
                  </Typography>
                )}
                
                {selectedExchange.exchangeReason && (
                  <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
                    <strong>Current Reason:</strong>{" "}
                    {selectedExchange.exchangeReason}
                  </Typography>
                )}

                <Typography variant="body2" sx={{ mb: 1 }}> 
                  <strong>Created At:</strong> {new Date(selectedExchange.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}> 
                  <strong>Updated At:</strong> {new Date(selectedExchange.updatedAt).toLocaleString()}
                </Typography>
              </>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Exchange Reason Textarea */}
            <TextField
              label="Reason for rejection (required)"
              multiline
              rows={3}
              value={exchangeReason}
              onChange={(e) => setExchangeReason(e.target.value)}
              fullWidth
              required
            />

            {/* Confirmation Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                />
              }
              label="I confirm the exchange rejection"
            />
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button 
            onClick={handleRejectConfirmation} 
            disabled={!isConfirmed || !exchangeReason}
            variant="contained"
            color="error"
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Documents Modal */}
      <Dialog 
        open={showDocumentsModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              <strong>Exchange Documents for:</strong> {selectedExchange?.customerId || "N/A"}
              {selectedExchange?.customerId && (
                <VerifiedRoundedIcon
                  sx={{
                    color: "#092e6b",
                    fontSize: 15,
                    mt: -0.3,
                    mr: -0.4,
                  }}
                />
              )}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers> 
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Full Name:</strong> {selectedExchange && getFullName(selectedExchange)}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {selectedExchange && (
              <>
                {Object.entries({
                  "RC Document": selectedExchange.rcDocument,
                  "Insurance Policy": selectedExchange.insurancePolicy,
                  "PUC Certificate": selectedExchange.pucCertificate,
                  "Identity Proof": selectedExchange.identityProof,
                  "Address Proof": selectedExchange.addressProof,
                  "Loan Clearance": selectedExchange.loanClearance,
                  "Service History": selectedExchange.serviceHistory,
                }).map(([key, value], index) => {
                  const { customerId, fileName } = getDocumentDetails(value);
                  return (
                    <React.Fragment key={key}> 
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                        <Typography variant="body2"><strong>{key}:</strong></Typography>
                        {fileName ? (
                          <Button
                            href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(fileName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DescriptionIcon />}
                            size="small"
                          >
                            View Document
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">N/A</Typography>
                        )}
                      </Box>
                      {index < 6 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  
};

export default ExchangePending;