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
  Tooltip,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ExchangeRejected = () => {
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
        const response = await axios.get(
          "http://localhost:5000/api/showexchange"
        );

        if (response.data && Array.isArray(response.data.data)) {
          // Filter only Rejected exchanges
          const RejectedExchanges = response.data.data.filter(
            (exchange) => exchange.status === "Rejected"
          );
          setCarExchanges(RejectedExchanges);
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
        exchangeReason,
      };

      const response = await axios.put(endpoint, payload);

      if (response.status === 200) {
        // Update the local state to remove the approved exchange
        setCarExchanges(
          carExchanges.filter(
            (exchange) => exchange.customerId !== selectedExchange?.customerId
          )
        );

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
    return `${exchange.firstName}${
      exchange.middleName ? ` ${exchange.middleName}` : ""
    } ${exchange.lastName}`;
  };

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    setExpandedRows({
      ...expandedRows,
      [id]: !expandedRows[id],
    });
  };

  // Get status chip color based on status
  const getStatusColor = (status) => {
    return "error"; // All will be Rejected in this version
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1">
                      ID: {exchange.customerId}
                    </Typography>
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
                    {expandedRows[exchange.customerId] ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ pt: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {getFullName(exchange)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exchange.carMake} | {exchange.carModel}
                </Typography>

                <Collapse
                  in={expandedRows[exchange.customerId]}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ mt: 2, mb: 1 }}>
           <Grid container spacing={2}>
                               {/* First Row - Contact Info and Timeline */}
                               <Grid container item xs={12} spacing={2}>
                                 <Grid item xs={12} md={6}>
                                   <Box sx={{ mb: 2 }}>
                                     <Typography
                                       variant="body2"
                                       sx={{ fontWeight: "medium", mb: 1 }}
                                     >
                                       Contact Information:
                                     </Typography>
                                     <Box sx={{ pl: 2 }}>
                                       <Typography variant="body2">
                                         <strong>Email:</strong>{" "}
                                         {exchange.email || "N/A"}
                                       </Typography>
                                       <Typography variant="body2">
                                         <strong>Phone 1:</strong>{" "}
                                         {exchange.mobileNumber1 || "N/A"}
                                       </Typography>
                                       {exchange.mobileNumber2 && (
                                         <Typography variant="body2">
                                           <strong>Phone 2:</strong>{" "}
                                           {exchange.mobileNumber2}
                                         </Typography>
                                       )}
                                     </Box>
                                   </Box>
                                 </Grid>
   
                                 <Grid item xs={12} md={6}>
                                   <Box sx={{ mb: 2 }}>
                                     <Typography
                                       variant="body2"
                                       sx={{ fontWeight: "medium", mb: 1 }}
                                     >
                                       Timeline:
                                     </Typography>
                                     <Box sx={{ pl: 2 }}>
                                       <Typography variant="body2">
                                         <strong>Created:</strong>{" "}
                                         {new Date(
                                           exchange.createdAt
                                         ).toLocaleString()}
                                       </Typography>
                                       <Typography variant="body2">
                                         <strong>Updated:</strong>{" "}
                                         {new Date(
                                           exchange.updatedAt
                                         ).toLocaleString()}
                                       </Typography>
                                     </Box>
                                   </Box>
                                 </Grid>
                               </Grid>
   
                               {/* Third Row - Car Information */}
                               <Grid item xs={12}>
                                 <Box sx={{ mb: 2 }}>
                                   <Typography
                                     variant="body2"
                                     sx={{ fontWeight: "medium", mb: 1 }}
                                   >
                                     Exchange Details:
                                   </Typography>
                                   <Box sx={{ pl: 2 }}>
                                     <Grid item xs={6} md={3}>
                                       <Typography variant="body2">
                                         <strong>Ex-Car Owner:</strong>{" "}
                                         {exchange.carOwnerFullName}
                                       </Typography>
                                     </Grid>
                                     <Grid item xs={6} md={3}>
                                       <Typography variant="body2">
                                         <strong>Car Color:</strong>{" "}
                                         {exchange.carColor}
                                       </Typography>
                                     </Grid>
                                     <Grid item xs={6} md={3}>
                                       <Typography variant="body2">
                                         <strong>Registration:</strong>{" "}
                                         {exchange.carRegistration}
                                       </Typography>
                                     </Grid>
                                     <Grid item xs={6} md={3}>
                                       <Typography variant="body2">
                                         <strong>Year:</strong> {exchange.carYear}
                                       </Typography>
                                     </Grid>
                                   </Box>
                                 </Box>
                               </Grid>
   
                               {/* Second Row - Exchange Details */}
                               <Grid item xs={12}>
                                 <Box sx={{ mb: 2 }}>
                                   <Typography
                                     variant="body2"
                                     sx={{ fontWeight: "medium", mb: 1 }}
                                   >
                                     Exchange Reason:
                                   </Typography>
                                   <Box sx={{ pl: 2 }}>
                                     {exchange.exchangeAmount && (
                                       <Typography variant="body2">
                                         <strong>Amount:</strong> ₹
                                         {exchange.exchangeAmount.toLocaleString()}
                                       </Typography>
                                     )}
                                     {exchange.exchangeReason && (
                                       <Typography
                                         variant="body2"
                                         sx={{ color: "error.main" }}
                                       >
                                         <strong>Current Reason:</strong>{" "}
                                         {exchange.exchangeReason}
                                       </Typography>
                                     )}
                                   </Box>
                                 </Box>
                               </Grid>
                             </Grid>
                  </Box>
                </Collapse>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<DescriptionIcon />}
                  onClick={() => handleDocumentsClick(exchange)}
                >
                  Docs
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
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography color="text.secondary">
              No Rejected exchanges found.
            </Typography>
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
              <TableCell align="center">Actions</TableCell>
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
                        {expandedRows[exchange.customerId] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {exchange.customerId}
                    </TableCell>
                    <TableCell>{getFullName(exchange)}</TableCell>
                    <TableCell>
                      {exchange.carMake} | {exchange.carModel}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exchange.status}
                        color={getStatusColor(exchange.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="View Documents">
                          <IconButton
                            size="small"
                            onClick={() => handleDocumentsClick(exchange)}
                            color="primary"
                            sx={{
                              border: `1px solid ${theme.palette.primary.main}`,
                              "&:hover": {
                                backgroundColor: theme.palette.primary.light,
                              },
                            }}
                          >
                            <DescriptionIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Approved Exchange">
                          <Button
                            variant="outlined"
                            onClick={() => handleApproveClick(exchange)}
                            size="small"
                            color="success"
                            startIcon={
                              <CheckCircleOutlineIcon fontSize="small" />
                            }
                          >
                            Approved
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={expandedRows[exchange.customerId]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1, py: 2 }}>
                                 <Grid container spacing={2}>
                                                     {/* First Row - Contact Info and Timeline */}
                                                     <Grid container item xs={12} spacing={2}>
                                                       <Grid item xs={12} md={6}>
                                                         <Box sx={{ mb: 2 }}>
                                                           <Typography
                                                             variant="body2"
                                                             sx={{ fontWeight: "medium", mb: 1 }}
                                                           >
                                                             Contact Information:
                                                           </Typography>
                                                           <Box sx={{ pl: 2 }}>
                                                             <Typography variant="body2">
                                                               <strong>Email:</strong>{" "}
                                                               {exchange.email || "N/A"}
                                                             </Typography>
                                                             <Typography variant="body2">
                                                               <strong>Phone 1:</strong>{" "}
                                                               {exchange.mobileNumber1 || "N/A"}
                                                             </Typography>
                                                             {exchange.mobileNumber2 && (
                                                               <Typography variant="body2">
                                                                 <strong>Phone 2:</strong>{" "}
                                                                 {exchange.mobileNumber2}
                                                               </Typography>
                                                             )}
                                                           </Box>
                                                         </Box>
                                                       </Grid>
                         
                                                       <Grid item xs={12} md={6}>
                                                         <Box sx={{ mb: 2 }}>
                                                           <Typography
                                                             variant="body2"
                                                             sx={{ fontWeight: "medium", mb: 1 }}
                                                           >
                                                             Timeline:
                                                           </Typography>
                                                           <Box sx={{ pl: 2 }}>
                                                             <Typography variant="body2">
                                                               <strong>Created:</strong>{" "}
                                                               {new Date(
                                                                 exchange.createdAt
                                                               ).toLocaleString()}
                                                             </Typography>
                                                             <Typography variant="body2">
                                                               <strong>Updated:</strong>{" "}
                                                               {new Date(
                                                                 exchange.updatedAt
                                                               ).toLocaleString()}
                                                             </Typography>
                                                           </Box>
                                                         </Box>
                                                       </Grid>
                                                     </Grid>
                         
                                                     {/* Third Row - Car Information */}
                                                     <Grid item xs={12}>
                                                       <Box sx={{ mb: 2 }}>
                                                         <Typography
                                                           variant="body2"
                                                           sx={{ fontWeight: "medium", mb: 1 }}
                                                         >
                                                           Exchange Details:
                                                         </Typography>
                                                         <Box sx={{ pl: 2 }}>
                                                           <Grid item xs={6} md={3}>
                                                             <Typography variant="body2">
                                                               <strong>Ex-Car Owner:</strong>{" "}
                                                               {exchange.carOwnerFullName}
                                                             </Typography>
                                                           </Grid>
                                                           <Grid item xs={6} md={3}>
                                                             <Typography variant="body2">
                                                               <strong>Car Color:</strong>{" "}
                                                               {exchange.carColor}
                                                             </Typography>
                                                           </Grid>
                                                           <Grid item xs={6} md={3}>
                                                             <Typography variant="body2">
                                                               <strong>Registration:</strong>{" "}
                                                               {exchange.carRegistration}
                                                             </Typography>
                                                           </Grid>
                                                           <Grid item xs={6} md={3}>
                                                             <Typography variant="body2">
                                                               <strong>Year:</strong> {exchange.carYear}
                                                             </Typography>
                                                           </Grid>
                                                         </Box>
                                                       </Box>
                                                     </Grid>
                         
                                                     {/* Second Row - Exchange Details */}
                                                     <Grid item xs={12}>
                                                       <Box sx={{ mb: 2 }}>
                                                         <Typography
                                                           variant="body2"
                                                           sx={{ fontWeight: "medium", mb: 1 }}
                                                         >
                                                           Exchange Reason:
                                                         </Typography>
                                                         <Box sx={{ pl: 2 }}>
                                                           {exchange.exchangeAmount && (
                                                             <Typography variant="body2">
                                                               <strong>Amount:</strong> ₹
                                                               {exchange.exchangeAmount.toLocaleString()}
                                                             </Typography>
                                                           )}
                                                           {exchange.exchangeReason && (
                                                             <Typography
                                                               variant="body2"
                                                               sx={{ color: "error.main" }}
                                                             >
                                                               <strong>Current Reason:</strong>{" "}
                                                               {exchange.exchangeReason}
                                                             </Typography>
                                                           )}
                                                         </Box>
                                                       </Box>
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
                <TableCell colSpan={6} align="center">
                  No Rejected exchanges found.
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
                        {expandedRows[exchange.customerId] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {exchange.customerId}
                    </TableCell>
                    <TableCell>{getFullName(exchange)}</TableCell>
                    <TableCell>{exchange.carOwnerFullName}</TableCell>
                    <TableCell>
                      {exchange.carMake} | {exchange.carModel} |{" "}
                      {exchange.carColor}
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="View Documents">
                          <IconButton
                            size="small"
                            onClick={() => handleDocumentsClick(exchange)}
                            color="primary"
                            sx={{
                              border: `1px solid ${theme.palette.primary.main}`,
                              "&:hover": {
                                backgroundColor: theme.palette.primary.light,
                              },
                            }}
                          >
                            <DescriptionIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Approved Exchange">
                          <Button
                            variant="outlined"
                            onClick={() => handleApproveClick(exchange)}
                            size="small"
                            color="success"
                            startIcon={
                              <CheckCircleOutlineIcon fontSize="small" />
                            }
                          >
                            Approved
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={9}
                    >
                      <Collapse
                        in={expandedRows[exchange.customerId]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1, py: 2 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Additional Details
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "medium", mb: 1 }}
                                >
                                  Contact Information:
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                  <Typography variant="body2">
                                    <strong>Email:</strong>{" "}
                                    {exchange.email || "N/A"}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Phone 1:</strong>{" "}
                                    {exchange.mobileNumber1 || "N/A"}
                                  </Typography>
                                  {exchange.mobileNumber2 && (
                                    <Typography variant="body2">
                                      <strong>Phone 2:</strong>{" "}
                                      {exchange.mobileNumber2}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "medium", mb: 1 }}
                                >
                                  Timeline:
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                  <Typography variant="body2">
                                    <strong>Created:</strong>{" "}
                                    {new Date(
                                      exchange.createdAt
                                    ).toLocaleString()}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Updated:</strong>{" "}
                                    {new Date(
                                      exchange.updatedAt
                                    ).toLocaleString()}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>

                            <Grid item xs={12}>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "medium", mb: 1 }}
                                >
                                  Exchange Details:
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                  {exchange.exchangeAmount && (
                                    <Typography variant="body2">
                                      <strong>Amount:</strong> ₹
                                      {exchange.exchangeAmount.toLocaleString()}
                                    </Typography>
                                  )}
                                  {exchange.exchangeReason && (
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "error.main" }}
                                    >
                                      <strong>Current Reason:</strong>{" "}
                                      {exchange.exchangeReason}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
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
                  No Rejected exchanges found.
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
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ color: "#071947" }}
      >
        Rejected Car Exchanges
      </Typography>

      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-start" },
          mb: 3,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          label="Search Rejected Exchanges"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: "100%", maxWidth: "400px" }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error &&
        !showApproveModal &&
        !showRejectModal &&
        !showDocumentsModal ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>
              <strong>Approve Exchange for:</strong>{" "}
              {selectedExchange?.customerId || "N/A"}
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
                  {`${selectedExchange.firstName} ${
                    selectedExchange.middleName || ""
                  } ${selectedExchange.lastName}`}
                </Typography>

                {selectedExchange.exchangeAmount && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Current Exchange Amount:</strong> ₹
                    {selectedExchange.exchangeAmount}
                  </Typography>
                )}

                {selectedExchange.exchangeReason && (
                  <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                    <strong>Current Reason:</strong>{" "}
                    {selectedExchange.exchangeReason}
                  </Typography>
                )}
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Amount Input */}
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
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

      {/* Documents Modal */}
      <Dialog
        open={showDocumentsModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>
              <strong>Exchange Documents for:</strong>{" "}
              {selectedExchange?.customerId || "N/A"}
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
            <strong>Full Name:</strong>{" "}
            {selectedExchange && getFullName(selectedExchange)}
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 1,
                        }}
                      >
                        <Typography variant="body2">
                          <strong>{key}:</strong>
                        </Typography>
                        {fileName ? (
                          <Button
                            href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(
                              fileName
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DescriptionIcon />}
                            size="small"
                          >
                            View Document
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
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

export default ExchangeRejected;
