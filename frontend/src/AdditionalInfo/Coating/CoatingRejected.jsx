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
  
const CoatingRejected = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [coatingReason, setCoatingReason] = useState("");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  // Fetch customers with insurance data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/showCoating"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to Coating customer data.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle error icon click
  const handleErrorIconClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Handle insurance approval
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/coatingapproval/update-status/${selectedCustomer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Coating approved successfully!");
        handleClose();
        // Refresh the data
        const newData = await axios.get(
          "http://localhost:5000/api/showCoating"
        );
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to approve Coating: ${err.response?.data?.error || err.message}`
      );
    }
  };

 

  // Close all modals and reset state
  const handleClose = () => {
    setShowModal(false);
    setShowDocumentsModal(false);
    setIsConfirmed(false);
    setCoatingReason("");
    setError(null);
  };

  // Handle documents icon click
  const handleDocumentsIconClick = (customer, insurance) => {
    setSelectedCustomer(customer);
    setSelectedInsurance(insurance);
    setShowDocumentsModal(true);
  };

  return (
    <>
      <div style={{ marginTop: "-36px", color: "#071947" }}>
        <p className="text-md-start my-4">Coating Rejected </p>
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
                <TableCell style={{ padding: "10px", fontSize: "10px" }}>
                  Customer ID
                </TableCell>
                <TableCell style={{ fontSize: "10px" }}>Full Name</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Email</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Car Details</TableCell>

                <TableCell style={{ fontSize: "10px" }}>
                  Coating Amount
                </TableCell>
                <TableCell style={{ fontSize: "10px" }}>Status</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(
                  (customer) =>
                    customer.coatingRequests[0]?.status === "Rejected" && (
                      <TableRow key={customer.customerId}>
                        <TableCell style={{ fontSize: "11px" }}>
                          {customer.customerId}
                        </TableCell>
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
                          title={`${customer.firstName}${
                            customer.middleName ? ` ${customer.middleName}` : ""
                          } ${customer.lastName}`}
                        >
                          {`${customer.firstName}${
                            customer.middleName ? ` ${customer.middleName}` : ""
                          } ${customer.lastName}`}
                        </TableCell>

                        <TableCell style={{ fontSize: "11px" }}>
                          {customer.email}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {`${customer.carBooking?.model || "N/A"} | ${
                            customer.carBooking?.version || "N/A"
                          } | ${customer.carBooking?.color || "N/A"}`}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {customer.coatingRequests[0]?.coating_amount || "N/A"}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          <Badge bg="danger">
                            {customer.coatingRequests[0]?.status || "N/A"}
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
                              handleDocumentsIconClick(
                                customer,
                                customer.coatingRequests[0]
                              )
                            }
                            variant="text"
                          >
                            Coating Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan="9" className="text-center">
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
          <Modal.Title>Coating Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInsurance && (
            <>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Customer ID:</strong> {selectedCustomer.customerId}
              </Typography>
              <Typography
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-block",
                  maxWidth: "200px", // Adjust based on your layout
                  verticalAlign: "middle",
                }}
                title={`${selectedCustomer.firstName}${
                  selectedCustomer.middleName
                    ? " " + selectedCustomer.middleName
                    : ""
                } ${selectedCustomer.lastName}`}
              >
                <strong>Full Name:</strong>{" "}
                {`${selectedCustomer.firstName}${
                  selectedCustomer.middleName
                    ? " " + selectedCustomer.middleName
                    : ""
                } ${selectedCustomer.lastName}`}
              </Typography>

              <Typography style={{ fontSize: "12px" }}>
                <strong>Coating Type:</strong> {selectedInsurance.coatingType}
              </Typography>

              <Typography style={{ fontSize: "12px" }}>
                <strong>Coating Amount:</strong>{" "}
                {selectedInsurance.coating_amount}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Preferred Date:</strong>{" "}
                {selectedInsurance.preferredDate &&
                  new Date(selectedInsurance.preferredDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Preferred Time At:</strong>{" "}
                {selectedInsurance.preferredTime}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Additional Notes:</strong>{" "}
                {selectedInsurance.additionalNotes}
              </Typography>

              <Typography style={{ fontSize: "12px" }}>
                <strong>Created At:</strong>{" "}
                {new Date(selectedInsurance.created_at).toLocaleString()}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Updated At:</strong>{" "}
                {new Date(selectedInsurance.updated_at).toLocaleString()}
              </Typography>

              <Typography style={{ fontSize: "12px",color:'red' }}>
                <strong style={{color:'black'}}>Coating Rejection Reason:</strong>{" "}
                {selectedInsurance.coatingReason}
              </Typography>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleApprove}
            >
              Approved
            </Button>

           

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>

     
    </>
  );
};

export default CoatingRejected;
