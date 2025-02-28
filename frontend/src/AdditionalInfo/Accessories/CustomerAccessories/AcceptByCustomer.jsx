import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

import "../CustomerAccessories/RequestByCustomer.scss";

const AcceptByCustomer = () => {
  const [orders, setOrders] = useState([]); // State to store orders with customer details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [selectedProducts, setSelectedProducts] = useState([]); // State to store products for the modal

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is mobile

  useEffect(() => {
    const fetchOrdersWithCustomers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getOrdersWithCustomers"
        );
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders");
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchOrdersWithCustomers();
  }, []);

  // Function to handle opening the modal
  const handleOpenModal = (products) => {
    setSelectedProducts(products);
    setOpenModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProducts([]);
  };

 

  return (
    <div className="orders-table-container">
      
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
      Accept By Customer
      </Typography>
     
      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table aria-label="Orders with customer details">
          <TableHead>
            <TableRow>
              <TableCell className="single-line-cell" sx={{ fontSize: "12px" }}>
                Customer ID
              </TableCell>
              <TableCell className="single-line-cell" sx={{ fontSize: "12px" }}>
                Full Name
              </TableCell>
              <TableCell className="single-line-cell" sx={{ fontSize: "12px" }}>
                Products
              </TableCell>
              <TableCell className="single-line-cell" sx={{ fontSize: "12px" }}>
                Total Amount
              </TableCell>
              <TableCell className="single-line-cell" sx={{ fontSize: "12px" }}>
                Request Status
              </TableCell>
              
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? ( // Show loading state
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? ( // Show error message
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders
                .filter((order) => order.requestStatus !== "Request") // Filter out accepted orders
                .map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow>
                      <TableCell
                        className="single-line-cell"
                        sx={{ fontSize: "12px" }}
                      >
                        {order.customerId}
                      </TableCell>
                      <TableCell
                        className="single-line-cell"
                        sx={{ fontSize: "12px" }}
                      >
                        {order.fullName}
                      </TableCell>
                      <TableCell sx={{ fontSize: "12px" }}>
                        <button
                          onClick={() => handleOpenModal(order.products)}
                          style={{
                            cursor: "pointer",
                            background: "none",
                            border: "none",
                            color: "blue",
                          }}
                        >
                          View Products
                        </button>
                      </TableCell>
                      <TableCell
                        className="single-line-cell"
                        sx={{ fontSize: "12px" }}
                      >
                        {/* Ensure totalAmount is a number before calling toFixed */}
                        ₹
                        {typeof order.totalAmount === "string"
                          ? parseFloat(order.totalAmount).toFixed(2)
                          : "N/A"}
                      </TableCell>

                       
                      <TableCell className="single-line-cell">
                        <Button
                          variant="outlined"
                          color={order.requestStatus === 'accept' ? 'success' : 'primary'}
                          size="small"    
                        >
                          Accept
                        </Button>
                    </TableCell>
                            
                    </TableRow>
                  </React.Fragment>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Products View */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400, // Adjust width for mobile and desktop
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 0,
            maxHeight: "80vh", // Limit height for mobile
            overflowY: "auto", // Enable scrolling for mobile
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            textAlign={"center"}
            gutterBottom
          >
            Products
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="single-line-cell">
                      {product.category}
                    </TableCell>
                    <TableCell className="single-line-cell">
                      {product.name}
                    </TableCell>
                    <TableCell className="single-line-cell">
                      ₹
                      {typeof product.price === "string"
                        ? parseFloat(product.price).toFixed(2)
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </div>
  );
};

AcceptByCustomer.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      customerId: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      requestStatus: PropTypes.string.isRequired,
      products: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          category: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
        })
      ).isRequired,
    })
  ),
};

export default AcceptByCustomer;
