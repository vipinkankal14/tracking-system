import React, { useState, useEffect } from "react";
import { Table, Spinner, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
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

import DescriptionIcon from "@mui/icons-material/Description";

const RTORejected = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [rtoReason, setRtoReason] = useState("");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  // Fetch customers with RTO data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showRTO");
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

  // Handle RTO approval
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/rtoapproval/update-status/${selectedCustomer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Insurance approved successfully!");
        handleClose();
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

  // Handle RTO rejection
  const handleReject = async () => {
    if (!isConfirmed) {
      setError("Please confirm the RTO rejection.");
      return;
    }

    if (!rtoReason) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/rtorejection/update-status/${selectedCustomer.customerId}`,
        {
          status: "Rejected",
          rtoReason,
        }
      );

      if (response.status === 200) {
        alert("RTO rejected successfully!");
        handleClose();
        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/showRTO");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(
        `Failed to reject RTO: ${err.response?.data?.error || err.message}`
      );
    }
  };

  // Close all modals and reset state
  const handleClose = () => {
    setShowModal(false);
    setShowDocumentsModal(false);
    setIsConfirmed(false);
    setRtoReason("");
    setError(null);
  };

  // Handle documents icon click
  const handleDocumentsIconClick = (customer, RTO) => {
    setSelectedCustomer(customer);
    setSelectedInsurance(RTO);
    setShowDocumentsModal(true);
  };

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
    <>
      <div style={{ marginTop: "-36px", color: "#071947" }}>
        <p className="text-md-start my-4">RTO Rejected</p>
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
           
                <TableCell style={{ fontSize: "10px" }}>RTO Amount</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Status</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(
                  (customer) =>
                    customer.RTORequests[0]?.status === "Rejected" && (
                      <TableRow key={customer.customerId}>
                        <TableCell style={{ fontSize: "11px" }}>
                          {customer.customerId}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          {`${customer.firstName} ${
                            customer.middleName || ""
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
                          {customer.RTORequests[0]?.rto_amount || "N/A"}
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          <Badge bg="danger">
                            {customer.RTORequests[0]?.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontSize: "11px" }}>
                          <DescriptionIcon
                            style={{ cursor: "pointer", color: "#1b1994" }}
                            onClick={() =>
                              handleDocumentsIconClick(
                                customer,
                                customer.RTORequests[0]
                              )
                            }
                          />
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
          <Modal.Title>RTO Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInsurance && (
            <>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Customer ID:</strong> {selectedCustomer.customerId}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Full Name:</strong>{" "}
                {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>RTO Amount:</strong> {selectedInsurance.rto_amount}
              </Typography>
              <Typography style={{ fontSize: "12px", color: "red" }}>
                <strong style={{ color: "black" }}>
                  RTO Rejection Reason:
                </strong>{" "}
                {selectedInsurance.rtoReason}
              </Typography>

              <Typography style={{ fontSize: "12px" }}>
                <strong>Created At:</strong>{" "}
                {new Date(selectedInsurance.createdAt).toLocaleString()}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                <strong>Updated At:</strong>{" "}
                {new Date(selectedInsurance.updatedAt).toLocaleString()}
              </Typography>

              <TableContainer component={Paper} style={{ marginTop: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: "12px" }}>
                        Document Name
                      </TableCell>
                      <TableCell style={{ fontSize: "12px" }}>
                        View Document
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ fontSize: "12px" }}>
                    {[
                      {
                        name: "Form 20 – Application for vehicle registration",
                        path: selectedInsurance.form20,
                      },
                      {
                        name: "Form 21 – Sale certificate issued by the dealer",
                        path: selectedInsurance.form22,
                      },
                      {
                        name: "Form 22 – Roadworthiness certificate from the manufacturer",
                        path: selectedInsurance.form22,
                      },
                      {
                        name: "Form 34 – If the vehicle is financed, this form is needed for hypothecation",
                        path: selectedInsurance.form34,
                      },
                      {
                        name: "Invoice of the Vehicle – Proof of purchase",
                        path: selectedInsurance.invoice,
                      },
                      {
                        name: "Insurance Certificate – Motor RTO is mandatory",
                        path: selectedInsurance.RTO,
                      },
                      {
                        name: "Pollution Under Control (PUC) Certificate – Emission compliance",
                        path: selectedInsurance.puc,
                      },
                      {
                        name: "Identity & Address Proof – Aadhaar, PAN, Passport, Voter ID, etc.",
                        path: selectedInsurance.idProof,
                      },
                      {
                        name: "Road Tax Payment Receipt – Paid at the RTO",
                        path: selectedInsurance.roadTax,
                      },
                      {
                        name: "Temporary Registration Certificate (if applicable)",
                        path: selectedInsurance.tempReg,
                      },
                    ].map((doc, index) => {
                      const { customerId, fileName } = getDocumentDetails(
                        doc.path
                      );
                      return (
                        <TableRow key={index}>
                          <TableCell style={{ fontSize: "12px" }}>
                            {doc.name}
                          </TableCell>
                          <TableCell style={{ fontSize: "10px" }}>
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

export default RTORejected;
