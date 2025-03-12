import React, { useState, useEffect } from "react";
import { Table, Spinner, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import {
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
  Box,
} from "@mui/material";
import { SearchIcon } from "lucide-react";

const AccessoriesReject = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [accessorieReason, setAccessorieReason] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers with accessories data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getOrdersWithCustomers"
        );
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
      customer.customerId?.toString().includes(searchQuery) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening products modal
  const handleOpenModal = (order, customer) => {
    setSelectedProducts(order.products);
    setSelectedCustomer(customer);
    setSelectedOrder(order);
    setOpenModal(true);
  };

  // Handle closing products modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProducts([]);
    setSelectedCustomer(null);
    setSelectedOrder(null);
  };

  // Handle insurance approval
  const handleApprove = async () => {
    try {
      setIsActionLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/accessoriesapproval/update-status/${selectedCustomer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Accessories approved successfully!");
        handleCloseModal();
        // Refresh the data
        const newData = await axios.get(
          "http://localhost:5000/api/getOrdersWithCustomers"
        );
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(`Failed to approve: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsActionLoading(false);
    }
  };

 

  // Close all modals and reset state
  const handleClose = () => {
    setShowModal(false);
    setIsConfirmed(false);
    setAccessorieReason("");
    setError(null);
    setSelectedOrder(null);
    setSelectedCustomer(null);
  };

  return (
    <>
      <div style={{ marginTop: "-36px", color: "#071947" }}>
        <p className="text-md-start my-4">Accessories Reject</p>
      </div>

      {/* Search Field */}
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

      {/* Loading & Error States */}
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

      {/* Main Table */}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "12px" }}>Customer ID</TableCell>
                <TableCell style={{ fontSize: "12px" }}>Name</TableCell>
                <TableCell style={{ fontSize: "12px" }}>Email</TableCell>
                <TableCell style={{ fontSize: "12px" }}>Car Details</TableCell>
                <TableCell style={{ fontSize: "12px" }}>Status</TableCell>
                <TableCell style={{ fontSize: "12px" }}>Amount</TableCell>
                <TableCell style={{ fontSize: "12px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) =>
                customer.orders?.map(
                  (order) =>
                    order.status === "Rejected" && (
                      <TableRow key={`${customer.customerId}-${order.orderId}`}>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 100,
                          }}
                        >
                          {customer.customerId}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {`${customer.firstName} ${
                            customer.middleName || ""
                          } ${customer.lastName}`}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
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

                        <TableCell style={{ fontSize: "12px" }}>
                          <Badge bg="danger">{order.status}</Badge>
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ₹{order.totalAmount}
                        </TableCell>

                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenModal(order, customer)}
                              sx={{
                                whiteSpace: "nowrap",
                                minWidth: "fit-content",
                              }}
                            >
                              View Products ({order.products?.length || 0})
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Products Modal */}
      <Modal show={openModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Products</Modal.Title>

        </Modal.Header>
        <Modal.Body>
          <Typography  gutterBottom>
            Customer: {selectedCustomer?.firstName} {selectedCustomer?.lastName}
          </Typography>
          <Typography  gutterBottom>
            Order ID: {selectedOrder?.orderId}
          </Typography>
          
          <Typography style={{color:'black'}} gutterBottom>
          Accessorie Rejection Reason  : <span style={{color:'red'}}>{selectedOrder?.accessorieReason}</span>
          </Typography>


          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "10px" }}>Category</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Name</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell style={{ fontSize: "10px" }}>
                    {product.category}
                  </TableCell>
                  <TableCell style={{ fontSize: "10px" }}>
                    {product.name}
                  </TableCell>
                  <TableCell style={{ fontSize: "10px" }}>
                    ₹ {product.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
              fontSize: "10px",
            }}
          >
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={handleApprove}
              disabled={isActionLoading}
            >
              {isActionLoading ? "Processing..." : "Approve"}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => setShowModal(true)}
              disabled={isActionLoading}
            >
              Reject
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>

    
    </>
  );
};

export default AccessoriesReject;