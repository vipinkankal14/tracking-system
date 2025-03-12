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
 
const GatepassPending = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [ex_Reason, setEx_Reason] = useState("");

  // Fetch customers with Gatepass data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showGatepass");
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

  // Filter customers based on search query and pending status
  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      customer.gatepassRequests?.some(req => req.status === "Pending")
  );

  // Handle Gatepass approval
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/gatepassApproval/${selectedCustomer.customerId}`,
        { status: "Approved" }
      );

      if (response.status === 200) {
        alert("Gatepass approved successfully!");
        handleClose();
        const newData = await axios.get("http://localhost:5000/api/showGatepass");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(`Failed to approve Gatepass: ${err.response?.data?.error || err.message}`);
      console.error("Error:", err);
    }
  };

  // Handle Gatepass rejection
  const handleReject = async () => {
    if (!ex_Reason) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/gatepassRejection/${selectedCustomer.customerId}`,
        {
          status: "Rejected",
          ex_Reason,
        }
      );

      if (response.status === 200) {
        alert("Gatepass rejected successfully!");
        handleClose();
        const newData = await axios.get("http://localhost:5000/api/showGatepass");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(`Failed to reject Gatepass: ${err.response?.data?.error || err.message}`);
      console.error("Error:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsConfirmed(false);
    setEx_Reason("");
    setError(null);
  };

  return (
    <>
      <div style={{ marginTop: "-36px", color: "#071947" }}>
        <Typography className="text-md-start my-4">Gatepass Pending</Typography>
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

      {/* Loading and error states remain the same */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: "10px" }}>Customer ID</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Full Name</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Email</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Car Details</TableCell>
               <TableCell style={{ fontSize: "10px" }}>Status</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.customerId}>
                <TableCell style={{ fontSize: "11px" }}>{customer.customerId}</TableCell>
                <TableCell style={{ fontSize: "11px" }}>
                  {`${customer.firstName} ${customer.lastName}`}
                </TableCell>
                <TableCell style={{ fontSize: "11px" }}>{customer.email}</TableCell>
                <TableCell style={{ fontSize: "11px" }}>
                  {customer.carBooking?.model || "N/A"}
                </TableCell>
                <TableCell style={{ fontSize: "11px" }}>
                  <Badge bg="warning">
                    {customer.gatepassRequests[0]?.status || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowModal(true);
                    }}
                    variant="text"
                    size="small"
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Approval/Rejection Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Typography>Process Gatepass for {selectedCustomer?.customerId}</Typography>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <>
              <Typography>Customer: {selectedCustomer.firstName} {selectedCustomer.lastName}</Typography>
              <Typography>Amount: ₹{selectedCustomer.gatepassRequests[0]?.amount}</Typography>
              
              {selectedCustomer.gatepassRequests[0]?.status === "Pending" && (
                <TextareaAutosize
                  minRows={3}
                  placeholder="Rejection reason (required)"
                  value={ex_Reason}
                  onChange={(e) => setEx_Reason(e.target.value)}
                  style={{ width: "100%", marginTop: "1rem" }}
                />
              )}
            </>
          )}
          {error && <Typography color="error">{error}</Typography>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            color="error"
            disabled={!ex_Reason}
          >
            Reject
          </Button>
          <Button 
            onClick={handleApprove} 
            color="success"
          >
            Approve
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GatepassPending;