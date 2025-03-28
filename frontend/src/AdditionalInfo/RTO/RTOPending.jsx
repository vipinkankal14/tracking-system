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
} from "@mui/icons-material";

// Mobile Card Row Component
const MobileCardRow = ({
  customer,
  handleDocumentsClick,
  handleApprove,
  handleReject,
  status,
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
    <Card
      sx={{
        mb: 2,
        border: `1px solid ${getStatusColor(customer.RTORequests[0]?.status)}`,
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
            {customer.customerId}
          </Typography>
          <Chip
            label={customer.RTORequests[0]?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(customer.RTORequests[0]?.status),
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
            onClick={() =>
              handleDocumentsClick(customer, customer.RTORequests[0])
            }
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
              <strong>Car Details:</strong>{" "}
              {customer.carBooking?.model || "N/A"} |{" "}
              {customer.carBooking?.version || "N/A"} |{" "}
              {customer.carBooking?.color || "N/A"}
            </Typography>
            {customer.RTORequests[0]?.rto_amount && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>RTO Amount:</strong>{" "}
                {customer.RTORequests[0]?.rto_amount}
              </Typography>
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

// Tablet Row Component
const TabletRow = ({
  customer,
  handleDocumentsClick,
  handleApprove,
  handleReject,
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
        <TableCell>
          <Chip
            label={customer.RTORequests[0]?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(customer.RTORequests[0]?.status),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() =>
              handleDocumentsClick(customer, customer.RTORequests[0])
            }
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
                    <strong>Car Details:</strong>{" "}
                    {customer.carBooking?.model || "N/A"} |{" "}
                    {customer.carBooking?.version || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>RTO Amount:</strong>{" "}
                    {customer.RTORequests[0]?.rto_amount || "N/A"}
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

// Desktop Row Component
const DesktopRow = ({
  customer,
  handleDocumentsClick,
  handleApprove,
  handleReject,
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
        <TableCell>{customer.RTORequests[0]?.rto_amount || "N/A"}</TableCell>
        <TableCell>
          <Chip
            label={customer.RTORequests[0]?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(customer.RTORequests[0]?.status),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() =>
                handleDocumentsClick(customer, customer.RTORequests[0])
              }
            >
              <DescriptionIcon />
            </IconButton>

            <Button
              size="small"
              color="success"
              onClick={() => handleApprove(customer)}
            >
              Approve
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleReject(customer)}
            >
              Reject
            </Button>
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
                    <strong>Created At:</strong>{" "}
                    {customer.RTORequests[0]?.createdAt
                      ? new Date(
                          customer.RTORequests[0].createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2">
                    <strong>Updated At:</strong>{" "}
                    {customer.RTORequests[0]?.updatedAt
                      ? new Date(
                          customer.RTORequests[0].updatedAt
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

// Rejection Modal Component (same as original)
const RejectionModal = ({
  open,
  handleClose,
  selectedCustomer,
  selectedRTO,
  handleReject,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [rtoReason, setRtoReason] = useState("");
  const [error, setError] = useState(null);

  const confirmReject = () => {
    if (!isConfirmed) {
      setError("Please confirm the rejection");
      return;
    }

    if (!rtoReason) {
      setError("Please provide a reason for rejection");
      return;
    }

    handleReject(selectedCustomer, rtoReason);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="rejection-modal-title"
      aria-describedby="rejection-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "50%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="rejection-modal-title"
          variant="h6"
          component="h2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <strong>Reject RTO for:</strong>{" "}
          {selectedCustomer?.customerId || "N/A"}{" "}
          {selectedCustomer?.customerId && (
            <VerifiedRoundedIcon
              sx={{
                color: "#092e6b",
                fontSize: "15px",
                ml: 1,
              }}
            />
          )}
        </Typography>

        {selectedCustomer && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Full Name:</strong>{" "}
              {`${selectedCustomer.firstName} ${
                selectedCustomer.middleName || ""
              } ${selectedCustomer.lastName}`}
            </Typography>
            {selectedRTO && (
              <Typography variant="body1">
                <strong>RTO Amount:</strong> {selectedRTO.rto_amount || "N/A"}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <TextareaAutosize
            minRows={3}
            placeholder="Reason for RTO rejection (required)"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
            value={rtoReason}
            onChange={(e) => setRtoReason(e.target.value)}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            }
            label="I confirm the RTO rejection"
            sx={{ mt: 2 }}
          />

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            color="error"
            disabled={!isConfirmed || !rtoReason}
          >
            Confirm Rejection
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Document Modal Component
const DocumentsModal = ({
  open,
  handleClose,
  selectedCustomer,
  selectedRTO,
  handleApprove,
  handleReject,
  status,
}) => {
  // Extract document details from the file path
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
      aria-labelledby="documents-modal-title"
      aria-describedby="documents-modal-description"
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
        <Typography id="documents-modal-title" variant="h6" component="h2">
          RTO Documents
        </Typography>

        {selectedCustomer && selectedRTO && (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Customer ID:</strong> {selectedCustomer.customerId}
              </Typography>
              <Typography variant="body1">
                <strong>Full Name:</strong>{" "}
                {`${selectedCustomer.firstName} ${
                  selectedCustomer.middleName || ""
                } ${selectedCustomer.lastName}`}
              </Typography>
              <Typography variant="body1">
                <strong>RTO Amount:</strong> {selectedRTO.rto_amount || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Created At:</strong>{" "}
                {selectedRTO.createdAt
                  ? new Date(selectedRTO.createdAt).toLocaleString()
                  : "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Updated At:</strong>{" "}
                {selectedRTO.updatedAt
                  ? new Date(selectedRTO.updatedAt).toLocaleString()
                  : "N/A"}
              </Typography>

              {selectedRTO.rtoReason && (
                <Typography variant="body1" sx={{ color: "error.main", mt: 1 }}>
                  <strong>Rejection Reason:</strong> {selectedRTO.rtoReason}
                </Typography>
              )}
            </Box>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Document Name</TableCell>
                    <TableCell>View Document</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    {
                      name: "Form 20 – Application for vehicle registration",
                      path: selectedRTO.form20,
                    },
                    {
                      name: "Form 21 – Sale certificate issued by the dealer",
                      path: selectedRTO.form21,
                    },
                    {
                      name: "Form 22 – Roadworthiness certificate from the manufacturer",
                      path: selectedRTO.form22,
                    },
                    {
                      name: "Form 34 – If the vehicle is financed, this form is needed for hypothecation",
                      path: selectedRTO.form34,
                    },
                    {
                      name: "Invoice of the Vehicle – Proof of purchase",
                      path: selectedRTO.invoice,
                    },
                    {
                      name: "Insurance Certificate – Motor insurance is mandatory",
                      path: selectedRTO.insurance,
                    },
                    {
                      name: "Pollution Under Control (PUC) Certificate – Emission compliance",
                      path: selectedRTO.puc,
                    },
                    {
                      name: "Identity & Address Proof – Aadhaar, PAN, Passport, Voter ID, etc.",
                      path: selectedRTO.idProof,
                    },
                    {
                      name: "Road Tax Payment Receipt – Paid at the RTO",
                      path: selectedRTO.roadTax,
                    },
                    {
                      name: "Temporary Registration Certificate (if applicable)",
                      path: selectedRTO.tempReg,
                    },
                  ].map((doc, index) => {
                    const { customerId, fileName } = getDocumentDetails(
                      doc.path
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>{doc.name}</TableCell>
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                gap: 1,
              }}
            >
              {status === "pending" && (
                <>
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
                    onClick={() => {
                      handleClose();
                      handleReject(selectedCustomer);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}

              {status === "rejected" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApprove(selectedCustomer)}
                >
                  Approve
                </Button>
              )}

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
const RTOPending = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRTO, setSelectedRTO] = useState(null);

  // Fetch customers with RTO data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/showRTO");
        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to load RTO data.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on search query (only pending)
  const getFilteredCustomers = () => {
    return customers.filter(
      (customer) =>
        customer.RTORequests[0]?.status === "Pending" &&
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

  // Handle documents modal
  const handleDocumentsClick = (customer, rto) => {
    setSelectedCustomer(customer);
    setSelectedRTO(rto);
    setDocumentsModalOpen(true);
  };

  // Handle rejection modal
  const handleRejectClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedRTO(customer.RTORequests[0]);
    setRejectionModalOpen(true);
  };

  // Handle approve action
  const handleApprove = async (customer) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/rtoapproval/update-status/${customer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("RTO approved successfully!");
        setDocumentsModalOpen(false);
        setRejectionModalOpen(false);

        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/showRTO");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to approve RTO: ${err.response?.data?.error || err.message}`
      );
    }
  };

  // Handle reject action
  const handleReject = async (customer, reason) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/rtorejection/update-status/${customer.customerId}`,
        {
          status: "Rejected",
          rtoReason: reason,
        }
      );

      if (response.status === 200) {
        alert("RTO rejected successfully!");
        setRejectionModalOpen(false);
        const newData = await axios.get("http://localhost:5000/api/showRTO");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to reject RTO: ${err.response?.data?.error || err.message}`
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#071947" }}>
        RTO Management - Pending Requests
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
                    handleDocumentsClick={handleDocumentsClick}
                    handleApprove={handleApprove}
                    handleReject={handleRejectClick}
                  />
                ))
              ) : (
                <Typography sx={{ textAlign: "center", my: 4 }}>
                  No pending records found.
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
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TabletRow
                        key={customer.customerId}
                        customer={customer}
                        handleDocumentsClick={handleDocumentsClick}
                        handleApprove={handleApprove}
                        handleReject={handleRejectClick}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                        No pending records found.
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
                    <TableCell>RTO Amount</TableCell>
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
                        handleDocumentsClick={handleDocumentsClick}
                        handleApprove={handleApprove}
                        handleReject={handleRejectClick}
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

      {/* Documents Modal */}
      <DocumentsModal
        open={documentsModalOpen}
        handleClose={() => setDocumentsModalOpen(false)}
        selectedCustomer={selectedCustomer}
        selectedRTO={selectedRTO}
        handleApprove={handleApprove}
        handleReject={handleRejectClick}
        
      />

      {/* Rejection Modal */}
      <RejectionModal
        open={rejectionModalOpen}
        handleClose={() => setRejectionModalOpen(false)}
        selectedCustomer={selectedCustomer}
        selectedRTO={selectedRTO}
        handleReject={handleReject}
      />
    </div>
  );
};

export default RTOPending;
