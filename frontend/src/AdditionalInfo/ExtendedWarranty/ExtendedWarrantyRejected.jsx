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
 
const ExtendedWarrantyRejected = () => {
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
      customer.extendedWarrantyRequests[0]?.status === "Rejected"
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
        <Typography className="text-md-start my-4">Extended Warranty Rejected</Typography>
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
                      <Badge bg="danger">
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
               <Typography style={{ fontSize: "12px",color:'red' }}>
                <strong style={{color:'black'}}>Extended Warranty Rejection Reason:</strong>{" "}
                {selectedExtendedWarranty.ex_Reason}
              </Typography>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button variant="contained" color="primary" size="small" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>

       
    </>
  );
};

export default ExtendedWarrantyRejected;