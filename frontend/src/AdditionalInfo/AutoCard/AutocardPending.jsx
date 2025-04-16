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
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";

// Mobile Card Row Component for Autocard
const AutocardMobileCard = ({
  customer,
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

  const autocardRequest = customer.autocardRequests[0];

  return (
    <Card
      sx={{
        mb: 2,
        border: `1px solid ${getStatusColor(autocardRequest?.status)}`,
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
            label={autocardRequest?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(autocardRequest?.status),
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
            onClick={() => handleDetailsClick(customer, autocardRequest)}
          >
            Details
          </Button>
          <IconButton size="small" onClick={toggleExpand}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
                 <Typography variant="h6" gutterBottom>
                          Customer Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Email:</strong> {customer.email || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Phone1:</strong> {customer.mobileNumber1 || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Phone2:</strong> {customer.mobileNumber2 || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
          
                        {/* Vehicle Details Section */}
                        <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                          Vehicle Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Allotment Status:</strong>{" "}
                              {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Chassis Number:</strong>{" "}
                              {customer?.stockInfo?.chassisNumber || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Engine Number:</strong>{" "}
                              {customer?.stockInfo?.engineNumber || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Car Details:</strong>{" "}
                              {customer.carBooking?.model || "N/A"} |{" "}
                              {customer.carBooking?.version || "N/A"} |{" "}
                              {customer.carBooking?.color || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
          
                        <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                          AutoCard Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>AutoCard Amount:</strong>{" "}
                              {autocardRequest?.autocardAmount || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Request Date:</strong>{" "}
                              {autocardRequest?.createdAt
                                ? new Date(autocardRequest.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : "N/A"}
                            </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Confirm Benefits:</strong>{" "}
                              {autocardRequest?.confirmBenefits || "N/A"}
                            </Typography>
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
      </CardContent>
    </Card>
  );
};

// Tablet Row Component for Autocard
const AutocardTabletRow = ({
  customer,
  handleDetailsClick,
  handleApprove,
  handleReject,
}) => {
  const [open, setOpen] = useState(false);
  const autocardRequest = customer.autocardRequests[0];

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
        <TableCell>{autocardRequest?.autocardAmount || "N/A"}</TableCell>
        <TableCell>
          <Chip
            label={autocardRequest?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(autocardRequest?.status),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => handleDetailsClick(customer, autocardRequest)}
          >
            <DescriptionIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
                 <Typography variant="h6" gutterBottom>
                          Customer Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Email:</strong> {customer.email || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Phone1:</strong> {customer.mobileNumber1 || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Phone2:</strong> {customer.mobileNumber2 || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
          
                        {/* Vehicle Details Section */}
                        <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                          Vehicle Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Allotment Status:</strong>{" "}
                              {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Chassis Number:</strong>{" "}
                              {customer?.stockInfo?.chassisNumber || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Engine Number:</strong>{" "}
                              {customer?.stockInfo?.engineNumber || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Car Details:</strong>{" "}
                              {customer.carBooking?.model || "N/A"} |{" "}
                              {customer.carBooking?.version || "N/A"} |{" "}
                              {customer.carBooking?.color || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
          
                        <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                          AutoCard Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>AutoCard Amount:</strong>{" "}
                              {autocardRequest?.autocardAmount || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Request Date:</strong>{" "}
                              {autocardRequest?.createdAt
                                ? new Date(autocardRequest.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : "N/A"}
                            </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Confirm Benefits:</strong>{" "}
                              {autocardRequest?.confirmBenefits || "N/A"}
                            </Typography>
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

// Desktop Row Component for Autocard
const AutocardDesktopRow = ({
  customer,
  handleDetailsClick,
  handleApprove,
  handleReject,
}) => {
  const [open, setOpen] = useState(false);
  const autocardRequest = customer.autocardRequests[0];

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
        <TableCell>{autocardRequest?.autocardAmount || "N/A"}</TableCell>
        <TableCell>
          <Chip
            label={autocardRequest?.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: getStatusColor(autocardRequest?.status),
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleDetailsClick(customer, autocardRequest)}
              title="View Details"
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
               
            
                     <Typography variant="h6" gutterBottom>
                              Customer Details
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>Email:</strong> {customer.email || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>Phone1:</strong> {customer.mobileNumber1 || "N/A"}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Phone2:</strong> {customer.mobileNumber2 || "N/A"}
                                </Typography>
                              </Grid>
                            </Grid>
              
                            {/* Vehicle Details Section */}
                            <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                              Vehicle Details
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>Allotment Status:</strong>{" "}
                                  {customer?.stockInfo?.allotmentStatus || "Not Allocated"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>VIN:</strong> {customer?.stockInfo?.vin || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>Chassis Number:</strong>{" "}
                                  {customer?.stockInfo?.chassisNumber || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>Engine Number:</strong>{" "}
                                  {customer?.stockInfo?.engineNumber || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2">
                                  <strong>Car Details:</strong>{" "}
                                  {customer.carBooking?.model || "N/A"} |{" "}
                                  {customer.carBooking?.version || "N/A"} |{" "}
                                  {customer.carBooking?.color || "N/A"}
                                </Typography>
                              </Grid>
                            </Grid>
              
                            <Typography variant="h6" gutterBottom sx={{ fontSize: "1rem" }}>
                              AutoCard Details
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>AutoCard Amount:</strong>{" "}
                                  {autocardRequest?.autocardAmount || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  <strong>Request Date:</strong>{" "}
                                  {autocardRequest?.createdAt
                                    ? new Date(autocardRequest.createdAt).toLocaleString(
                                        "en-IN",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        }
                                      )
                                    : "N/A"}
                                </Typography>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                                <Typography variant="body2">
                                  <strong>Confirm Benefits:</strong>{" "}
                                  {autocardRequest?.confirmBenefits || "N/A"}
                                </Typography>
                              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Autocard Details Modal
const AutocardDetailsModal = ({
  open,
  handleClose,
  selectedCustomer,
  selectedAutocard,
  handleApprove,
  handleReject,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="autocard-details-modal-title"
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
          id="autocard-details-modal-title"
          variant="h6"
          component="h2"
        >
          Autocard Details
        </Typography>

        {selectedCustomer && selectedAutocard && (
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
                      label={selectedAutocard.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          selectedAutocard.status === "Pending"
                            ? "#f57c00"
                            : selectedAutocard.status === "Approval"
                            ? "#4caf50"
                            : selectedAutocard.status === "Rejected"
                            ? "#f44336"
                            : "#9e9e9e",
                        color: "white",
                      }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Full Name:</strong>{" "}
                    {`${selectedCustomer.firstName} ${
                      selectedCustomer.middleName || ""
                    } ${selectedCustomer.lastName}`}
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
                    {`${selectedCustomer.carBooking?.model || "N/A"} | ${
                      selectedCustomer.carBooking?.version || "N/A"
                    } | ${selectedCustomer.carBooking?.color || "N/A"}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Autocard Amount:</strong>{" "}
                    {selectedAutocard.autocardAmount}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Created At:</strong>{" "}
                    {selectedAutocard.createdAt
                      ? new Date(selectedAutocard.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Updated At:</strong>{" "}
                    {selectedAutocard.updatedAt
                      ? new Date(selectedAutocard.updatedAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Confirm Benefits:</strong>{" "}
                    {selectedAutocard.confirmBenefits || "N/A"}
                  </Typography>
                </Grid>
                {selectedAutocard.autoCardReason && (
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ color: "error.main" }}>
                      <strong>Rejection Reason:</strong>{" "}
                      {selectedAutocard.autoCardReason}
                    </Typography>
                  </Grid>
                )}
              </Grid>
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
const RejectionModal = ({
  open,
  handleClose,
  selectedCustomer,
  selectedAutocard,
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
          <strong>Reject Autocard Request:</strong>{" "}
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
              <strong>Customer:</strong>{" "}
              {`${selectedCustomer.firstName} ${
                selectedCustomer.middleName || ""
              } ${selectedCustomer.lastName}`}
            </Typography>
            {selectedAutocard && (
              <Typography variant="body1">
                <strong>Amount:</strong> {selectedAutocard.autocardAmount}
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
            label="I confirm the rejection of this Autocard request"
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
const AutocardPending = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [autocardCustomers, setAutocardCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [autocardDetailsModalOpen, setAutocardDetailsModalOpen] =
    useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAutocard, setSelectedAutocard] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch autocard data
        const autocardResponse = await axios.get(
          "http://localhost:5000/api/showAutocard"
        );
        if (
          autocardResponse.data &&
          Array.isArray(autocardResponse.data.data)
        ) {
          setAutocardCustomers(autocardResponse.data.data);
        } else {
          throw new Error("Invalid autocard data format");
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

  // Filter customers based on search query and Pending status
  const getFilteredAutocardCustomers = () => {
    return autocardCustomers.filter(
      (customer) =>
        (customer.customerId?.toString().includes(searchQuery) ||
          customer.firstName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.lastName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        customer.autocardRequests?.length > 0 &&
        customer.autocardRequests[0]?.status === "Pending"
    );
  };

  // Handle autocard details modal
  const handleAutocardDetailsClick = (customer, autocard) => {
    setSelectedCustomer(customer);
    setSelectedAutocard(autocard);
    setAutocardDetailsModalOpen(true);
  };

  // Handle reject click
  const handleRejectClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedAutocard(customer.autocardRequests[0]);
    setRejectionModalOpen(true);
  };

  // Handle approve action for autocard
  const handleAutocardApprove = async (customer) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `http://localhost:5000/api/autocardApproval/update-status/${customer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Autocard approved successfully!");

        // Close any open modals
        setAutocardDetailsModalOpen(false);

        // Refresh the data
        const newData = await axios.get(
          "http://localhost:5000/api/showAutocard"
        );
        setAutocardCustomers(newData.data.data);

        setLoading(false);
      }
    } catch (err) {
      setError(
        `Failed to approve autocard: ${
          err.response?.data?.error || err.message
        }`
      );
      setLoading(false);
    }
  };

  // Handle confirm reject action for autocard
  const handleAutocardConfirmReject = async (customer, reason) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `http://localhost:5000/api/autocardRejection/update-status/${customer.customerId}`,
        {
          status: "Rejected",
          autoCardReason: reason,
        }
      );

      if (response.status === 200) {
        alert("Autocard rejected successfully!");

        // Refresh the data
        const newData = await axios.get(
          "http://localhost:5000/api/showAutocard"
        );
        setAutocardCustomers(newData.data.data);

        setLoading(false);
      }
    } catch (err) {
      setError(
        `Failed to reject autocard: ${err.response?.data?.error || err.message}`
      );
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, color: "#071947", display: "flex", alignItems: "center" }}
      >
        Pending Autocard Requests
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
              {getFilteredAutocardCustomers().length > 0 ? (
                getFilteredAutocardCustomers().map((customer) => (
                  <AutocardMobileCard
                    key={customer.customerId}
                    customer={customer}
                    handleDetailsClick={handleAutocardDetailsClick}
                    handleApprove={handleAutocardApprove}
                    handleReject={() => handleRejectClick(customer)}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", my: 4 }}>
                  <Typography>No pending autocard requests found.</Typography>
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
                  {getFilteredAutocardCustomers().length > 0 ? (
                    getFilteredAutocardCustomers().map((customer) => (
                      <AutocardTabletRow
                        key={customer.customerId}
                        customer={customer}
                        handleDetailsClick={handleAutocardDetailsClick}
                        handleApprove={handleAutocardApprove}
                        handleReject={() => handleRejectClick(customer)}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                        No pending autocard requests found.
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
                  {getFilteredAutocardCustomers().length > 0 ? (
                    getFilteredAutocardCustomers().map((customer) => (
                      <AutocardDesktopRow
                        key={customer.customerId}
                        customer={customer}
                        handleDetailsClick={handleAutocardDetailsClick}
                        handleApprove={handleAutocardApprove}
                        handleReject={() => handleRejectClick(customer)}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                        No pending autocard requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Autocard Details Modal */}
      <AutocardDetailsModal
        open={autocardDetailsModalOpen}
        handleClose={() => setAutocardDetailsModalOpen(false)}
        selectedCustomer={selectedCustomer}
        selectedAutocard={selectedAutocard}
        handleApprove={handleAutocardApprove}
        handleReject={() => handleRejectClick(selectedCustomer)}
      />

      {/* Rejection Modal */}
      <RejectionModal
        open={rejectionModalOpen}
        handleClose={() => setRejectionModalOpen(false)}
        selectedCustomer={selectedCustomer}
        selectedAutocard={selectedAutocard}
        handleConfirmReject={handleAutocardConfirmReject}
      />
    </Box>
  );
};

export default AutocardPending;
