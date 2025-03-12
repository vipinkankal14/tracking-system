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

const PaymentRefundDebit = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows

  // Fetch customers with Gatepass data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getAllAccountManagementRefund");
        console.log(response.data.data); // Log the response
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

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle row expansion
  const toggleRow = (customerId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [customerId]: !prev[customerId], // Toggle the expanded state
    }));
  };

  // Calculate total refund amount for a customer
  const calculateTotalRefundAmount = (customer) => {
    if (!customer.accountmanagementrefundRequests) return 0;
    return customer.accountmanagementrefundRequests.reduce(
      (total, refund) => total + (parseFloat(refund.refundAmount) || 0),
      0
    );
  };

  return (
    <>
      <div style={{ marginTop: "-36px", color: "#071947" }}>
        <Typography className="text-md-start my-4">accountmanagementrefundRequests Pending</Typography>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: "10px" }}>Customer ID</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Full Name</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Email</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Car Details</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Refund Total Amount</TableCell>
              <TableCell style={{ fontSize: "10px" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <React.Fragment key={customer.customerId}>
                <TableRow>
                  <TableCell style={{ fontSize: "11px" }}>{customer.customerId}</TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    {`${customer.firstName} ${customer.lastName}`}
                  </TableCell>
                  <TableCell style={{ fontSize: "11px" }}>{customer.email}</TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    {customer.carBooking?.model || "N/A"}
                  </TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    {calculateTotalRefundAmount(customer).toFixed(2)} {/* Display total refund amount */}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => toggleRow(customer.customerId)} // Toggle row expansion
                    >
                      Refund History
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows[customer.customerId] && ( // Render nested table if row is expanded
                  <TableRow>
                    <TableCell colSpan={6} style={{ padding: 0 }}>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ fontSize: "10px" }}>Refund ID</TableCell>
                              <TableCell style={{ fontSize: "10px" }}>Status</TableCell>
                              <TableCell style={{ fontSize: "10px" }}>Reason</TableCell>
                              <TableCell style={{ fontSize: "10px" }}>Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {customer.accountmanagementrefundRequests.map((refund) => (
                              <TableRow key={refund.id}>
                                <TableCell style={{ fontSize: "11px" }}>{refund.id}</TableCell>
                                <TableCell style={{ fontSize: "11px" }}>{refund.status}</TableCell>
                                <TableCell style={{ fontSize: "11px" }}>{refund.refundReason}</TableCell>
                                <TableCell style={{ fontSize: "11px" }}>{refund.refundAmount}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PaymentRefundDebit;