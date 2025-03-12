import React, { useState, useEffect } from "react";
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
  TextField,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, CheckCircle, Cancel, HourglassEmpty } from "@mui/icons-material";

const SecurityclearancePending = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [statusData, setStatusData] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Fetch customers with Gatepass data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showPreDeliveryInspection");
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

  // Generate status data when a row is expanded
  useEffect(() => {
    if (expandedRow) {
      const selectedCustomer = customers.find(customer => customer.customerId === expandedRow);
      if (selectedCustomer) {
        const { additional_info, loans, orders_accessories_request, car_fasttag_requests, car_insurance_requests, car_extended_warranty_requests, car_autocard_requests } = selectedCustomer;

        const statusData = [];

        if (additional_info.finance === "Yes" && loans) {
          statusData.push({
            id: "finance",
            name: "Finance",
            status: loans.status,
            reason: loans.financeReason,
            createdAt: loans.createdAt,
            updatedAt: loans.updatedAt,
          });
        }

        if (additional_info.accessories === "Yes" && orders_accessories_request) {
          statusData.push({
            id: "accessories",
            name: "Accessories",
            status: orders_accessories_request.status,
            reason: orders_accessories_request.accessorieReason,
            createdAt: orders_accessories_request.createdAt,
            updatedAt: orders_accessories_request.updatedAt,
          });
        }

        if (additional_info.fast_tag === "Yes" && car_fasttag_requests) {
          statusData.push({
            id: "fast_tag",
            name: "Fast Tag",
            status: car_fasttag_requests.status,
            reason: car_fasttag_requests.fastTagReason,
            createdAt: car_fasttag_requests.createdAt,
            updatedAt: car_fasttag_requests.updatedAt,
          });
        }

        if (additional_info.insurance === "Yes" && car_insurance_requests) {
          statusData.push({
            id: "insurance",
            name: "Insurance",
            status: car_insurance_requests.status,
            reason: car_insurance_requests.insuranceReason,
            createdAt: car_insurance_requests.createdAt,
            updatedAt: car_insurance_requests.updatedAt,
          });
        }

        if (additional_info.extended_warranty === "Yes" && car_extended_warranty_requests) {
          statusData.push({
            id: "extended_warranty",
            name: "Extended Warranty",
            status: car_extended_warranty_requests.status,
            reason: car_extended_warranty_requests.ex_Reason,
            createdAt: car_extended_warranty_requests.createdAt,
            updatedAt: car_extended_warranty_requests.updatedAt,
          });
        }

        if (additional_info.auto_card === "Yes" && car_autocard_requests) {
          statusData.push({
            id: "auto_card",
            name: "Auto Card",
            status: car_autocard_requests.status,
            reason: car_autocard_requests.autoCardReason,
            createdAt: car_autocard_requests.createdAt,
            updatedAt: car_autocard_requests.updatedAt,
          });
        }

        setStatusData(statusData);
      }
    }
  }, [expandedRow, customers]);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle row expansion
  const handleRowExpand = (customerId) => {
    setExpandedRow(expandedRow === customerId ? null : customerId);
  };

  // Status icon component
  const StatusIcon = ({ status }) => {
    if (status === "Approval" || status === "Completed") {
      return <CheckCircle sx={{ color: 'success.main' }} />;
    } else if (status === "Rejected") {
      return <Cancel sx={{ color: 'error.main' }} />;
    } else if (status === "Pending") {
      return <HourglassEmpty sx={{ color: 'warning.main' }} />;
    }
    return <HourglassEmpty sx={{ color: 'text.disabled' }} />;
  };

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Mobile view for customer cards
  const MobileCustomerCard = ({ customer }) => {
    const isExpanded = expandedRow === customer.customerId;
    
    return (
      <Card sx={{ mb: 2, border: isExpanded ? `1px solid ${theme.palette.primary.main}` : 'none' }}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {`${customer.firstName} ${customer.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {customer.customerId}
              </Typography>
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Chip 
                label="Pending" 
                color="warning" 
                size="small"
              />
            </Grid>
          </Grid>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            {customer.email}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Car: {customer.carBooking?.model || "N/A"}
          </Typography>
          
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => handleRowExpand(customer.customerId)}
              variant={isExpanded ? "contained" : "outlined"}
              size="small"
              color={isExpanded ? "primary" : "inherit"}
            >
              {isExpanded ? "Hide Details" : "Manage"}
            </Button>
          </Box>
          
          {isExpanded && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Status Details
              </Typography>
              
              {statusData.length > 0 ? (
                statusData.map((status) => (
                  <Card key={status.id} variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {status.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StatusIcon status={status.status} />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {status.status}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Updated: {formatDate(status.updatedAt)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No status data available
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Desktop view with table
  const DesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer ID</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Car Details</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <React.Fragment key={customer.customerId}>
              <TableRow sx={{ 
                backgroundColor: expandedRow === customer.customerId ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
              }}>
                <TableCell>{customer.customerId}</TableCell>
                <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.carBooking?.model || "N/A"}</TableCell>
                <TableCell>
                  <Chip label="Pending" color="warning" size="small" />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleRowExpand(customer.customerId)}
                    variant={expandedRow === customer.customerId ? "contained" : "outlined"}
                    size="small"
                    color={expandedRow === customer.customerId ? "primary" : "inherit"}
                  >
                    {expandedRow === customer.customerId ? "Hide" : "Manage"}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRow === customer.customerId && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ p: 0, borderBottom: 'none' }}>
                    <Box sx={{ p: 4, backgroundColor: '#f9f9f9' }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Status Details for Customer: {customer.customerId}
                      </Typography>
                      {statusData.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Service</TableCell>
                                <TableCell>Status</TableCell>
 
                                 <TableCell>Created At</TableCell>
                                <TableCell>Updated At</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {statusData.map((status) => (
                                <TableRow key={status.id}>
                                  <TableCell>{status.name}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <StatusIcon status={status.status} />
                                      <Typography variant="body2" sx={{ ml: 2 }}>
                                        {status.status}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                   <TableCell>{formatDate(status.createdAt)}</TableCell>
                                  <TableCell>{formatDate(status.updatedAt)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No status data available for this customer
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: 3, color: "#071947", fontWeight: 'bold' }}>
      Security clearance Pending
      </Typography>

      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: { xs: 'center', sm: 'flex-start' },
        alignItems: { xs: 'stretch', sm: 'center' }
      }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          label="Search Customers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth={isMobile}
          sx={{ maxWidth: { sm: '300px' } }}
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ 
          p: 2, 
          bgcolor: 'error.light', 
          color: 'error.dark', 
          borderRadius: 1,
          my: 2
        }}>
          {error}
        </Box>
      ) : filteredCustomers.length === 0 ? (
        <Box sx={{ 
          p: 3, 
          textAlign: 'center', 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          border: '1px dashed',
          borderColor: 'divider',
          my: 2
        }}>
          <Typography>No customers found matching your search criteria</Typography>
        </Box>
      ) : (
        <>
          {/* Mobile view */}
          {isMobile && (
            <Box>
              {filteredCustomers.map((customer) => (
                <MobileCustomerCard key={customer.customerId} customer={customer} />
              ))}
            </Box>
          )}
          
          {/* Tablet view - simplified table */}
          {isTablet && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Car</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <React.Fragment key={customer.customerId}>
                      <TableRow sx={{ 
                        backgroundColor: expandedRow === customer.customerId ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
                      }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {`${customer.firstName} ${customer.lastName}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.customerId}
                          </Typography>
                        </TableCell>
                        <TableCell>{customer.carBooking?.model || "N/A"}</TableCell>
                        <TableCell>
                          <Chip label="Pending" color="warning" size="small" />
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleRowExpand(customer.customerId)}
                            variant={expandedRow === customer.customerId ? "contained" : "outlined"}
                            size="small"
                            color={expandedRow === customer.customerId ? "primary" : "inherit"}
                          >
                            {expandedRow === customer.customerId ? "Hide" : "Manage"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRow === customer.customerId && (
                        <TableRow>
                          <TableCell colSpan={4} sx={{ p: 0, borderBottom: 'none' }}>
                            <Box sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                              {statusData.length > 0 ? (
                                <Grid container spacing={2}>
                                  {statusData.map((status) => (
                                    <Grid item xs={12} key={status.id}>
                                      <Card variant="outlined">
                                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                          <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                {status.name}
                                              </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <StatusIcon status={status.status} />
                                                <Typography variant="body2" sx={{ ml: 0.5 }}>
                                                  {status.status}
                                                </Typography>
                                              </Box>
                                            </Grid>
                                         
                                            <Grid item xs={12}>
                                              <Typography variant="caption" color="text.secondary">
                                                Updated: {formatDate(status.updatedAt)}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </CardContent>
                                      </Card>
                                    </Grid>
                                  ))}
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
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {/* Desktop view - full table */}
          {!isMobile && !isTablet && <DesktopView />}
        </>
      )}
    </Box>
  );
};

export default SecurityclearancePending;
