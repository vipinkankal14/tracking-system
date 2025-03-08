import React, { useState, useEffect } from "react";
import { Table, Spinner, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

const ExtendedWarrantyPending = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [ex_Reason, setEx_Reason] = useState("");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedExtendedWarranty, setSelectedExtendedWarranty] = useState(null);

  // Fetch customers with extended warranty data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showExtendedWarranty");
        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to fetch extended warranty customer data.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on search query and pending status
  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      customer.extendedWarrantyRequests?.length > 0 &&
      customer.extendedWarrantyRequests[0]?.status === "Pending"
  );

  // Handle documents icon click
  const handleDocumentsIconClick = (customer, warranty) => {
    setSelectedCustomer(customer);
    setSelectedExtendedWarranty(warranty);
    setShowDocumentsModal(true);
  };

  // Handle extended warranty approval
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/extendedWarrantyApproval/update-status/${selectedCustomer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Extended warranty approved successfully!");
        handleClose();
        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/showExtendedWarranty");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(`Failed to approve extended warranty: ${err.response?.data?.error || err.message}`);
      console.error("Error:", err);
    }
  };

  // Handle extended warranty rejection
  const handleReject = async () => {
    if (!isConfirmed) {
      setError("Please confirm the extended warranty rejection.");
      return;
    }

    if (!ex_Reason) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/extendedWarrantyRejection/update-status/${selectedCustomer.customerId}`,
        {
          status: "Rejected",
          ex_Reason,
        }
      );

      if (response.status === 200) {
        alert("Extended warranty rejected successfully!");
        handleClose();
        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/showExtendedWarranty");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(`Failed to reject extended warranty: ${err.response?.data?.error || err.message}`);
      console.error("Error:", err);
    }
  };

  // Close all modals and reset state
  const handleClose = () => {
    setShowModal(false);
    setShowDocumentsModal(false);
    setIsConfirmed(false);
    setEx_Reason("");
    setError(null);
  };

  return (
    <>
      <div style={{ marginTop: "-36px", color: "#071947" }}>
        <Typography className="text-md-start my-4">Extended Warranty Pending</Typography>
      </div>
      <div className="d-flex justify-content-center justify-content-md-start">
        <div className="mb-4">
          <TextField
            variant="outlined"
            placeholder="Search..."
            label="Search Customers"
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
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <div className="text-center text-danger">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: "10px", fontSize: "10px" }}>Customer ID</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Full Name</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Email</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Car Details</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Extended Warranty Amount</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Status</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell style={{ fontSize: "11px" }}>{customer.customerId}</TableCell>
                    <TableCell
                      style={{
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                        verticalAlign: "middle",
                        padding: "8px",
                      }}
                      title={`${customer.firstName}${customer.middleName ? ` ${customer.middleName}` : ""} ${customer.lastName}`}
                    >
                      {`${customer.firstName}${customer.middleName ? ` ${customer.middleName}` : ""} ${customer.lastName}`}
                    </TableCell>
                    <TableCell style={{ fontSize: "11px" }}>{customer.email}</TableCell>
                    <TableCell
                      sx={{
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {`${customer.carBooking?.model || "N/A"} | ${customer.carBooking?.version || "N/A"} | ${customer.carBooking?.color || "N/A"}`}
                    </TableCell>
                    <TableCell style={{ fontSize: "11px" }}>
                      {customer.extendedWarrantyRequests[0]?.extendedwarranty_amount || "N/A"}
                    </TableCell>
                    <TableCell style={{ fontSize: "11px" }}>
                      <Badge bg="warning">
                        {customer.extendedWarrantyRequests[0]?.status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ fontSize: "11px" }}>
                      <Button
                        style={{
                          cursor: "pointer",
                          color: "#1b1994",
                          textTransform: "none",
                          padding: "6px 12px",
                          fontSize: "0.875rem",
                        }}
                        onClick={() =>
                          handleDocumentsIconClick(customer, customer.extendedWarrantyRequests[0])
                        }
                        variant="text"
                      >
                        Ex-Warranty Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="7" className="text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Documents Modal */}
      <Modal
        show={showDocumentsModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Extended Warranty Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExtendedWarranty && (
            <>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Customer ID:</strong> {selectedCustomer.customerId}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Full Name:</strong>{" "}
                {`${selectedCustomer.firstName}${selectedCustomer.middleName ? ` ${selectedCustomer.middleName}` : ""} ${selectedCustomer.lastName}`}
              </Typography>
           
              <Typography style={{ fontSize: "12px" }}>
                <strong>Extended Warranty Amount:</strong> {selectedExtendedWarranty.extendedwarranty_amount}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Created At:</strong>{" "}
                {new Date(selectedExtendedWarranty.createdAt).toLocaleString()}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Updated At:</strong>{" "}
                {new Date(selectedExtendedWarranty.updatedAt).toLocaleString()}
              </Typography>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button variant="contained" color="success" size="small" onClick={handleApprove}>
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                setShowDocumentsModal(false);
                setShowModal(true);
              }}
            >
              Reject
            </Button>
            <Button variant="contained" color="primary" size="small" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Typography>
            <strong>Reject Extended Warranty for:</strong>{" "}
            {selectedCustomer?.customerId || "N/A"}{" "}
            {selectedCustomer?.customerId && (
              <VerifiedRoundedIcon
                style={{
                  color: "#092e6b",
                  fontSize: "15px",
                  marginTop: "-3px",
                  marginRight: "-4px",
                }}
              />
            )}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Typography fontSize={12}>
            {selectedCustomer && (
              <>
                <Typography>
                  <strong>Full Name:</strong>{" "}
                  {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
                </Typography>
              </>
            )}
          </Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextareaAutosize
              minRows={3}
              placeholder="Reason for extended warranty rejection (required)"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
              value={ex_Reason}
              onChange={(e) => setEx_Reason(e.target.value)}
              required
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <input
                type="checkbox"
                id="confirmCheckbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label
                htmlFor="confirmCheckbox"
                style={{
                  marginLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                I confirm the extended warranty rejection
              </label>
            </div>
          </div>
          {error && (
            <Typography
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "5px",
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button variant="outlined" size="small" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={!isConfirmed || !ex_Reason}
              onClick={handleReject}
            >
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExtendedWarrantyPending;