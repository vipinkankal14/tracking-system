import React, { useState } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    
} from "@mui/material";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

const accessoriesData = [
    { id: 1, name: "Wireless Earbuds Pro", price: 129.99 },
    { id: 2, name: "Premium Phone Case", price: 34.99 },
    { id: 3, name: "Fast Charging Power Bank", price: 59.99 },
    { id: 4, name: "Tempered Glass Screen Guard", price: 24.99 },
    { id: 5, name: "Bluetooth Speaker", price: 89.99 },
    { id: 6, name: "Car Charger", price: 19.99 },
    { id: 7, name: "Smartwatch", price: 199.99 },
    { id: 8, name: "Laptop Sleeve", price: 49.99 },
];

const AddToCart = () => {
    const location = useLocation();
    const navigate = useNavigate();
  
    const { addedItems, fullName, mobile, mobile2, email, customerId } = location.state || {};
  
    const [selectedProducts, setSelectedProducts] = useState(
      accessoriesData.filter((item) => addedItems.includes(item.id))
    );
  
    const totalAmount = selectedProducts.reduce(
      (sum, product) => sum + product.price,
      0
    );
  
    const handleRemove = (id) => {
      setSelectedProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    };
  
    const handleCheckout = (event) => {
      event.preventDefault();
      alert("Proceeding to checkout!");
      navigate("/checkout", {
        state: {
          addedItems,
          fullName,
          mobile,
          mobile2,
          email,
          customerId,
        },
      });
    };

    const handleCancel = () => {
      navigate(-1); // Navigate back to the previous page
    };
  
    return (
      <div style={{ padding: "20px" }}>
        <Typography variant="p" gutterBottom>
          <p>Customer Id: {customerId}</p>
          <p>Full Name: {fullName}</p>
          <p>Phone Number: {mobile},{mobile2}</p>
          <p>Email: {email}</p>  
        </Typography>
  
        {selectedProducts.length === 0 ? (
          <Typography variant="h6" color="textSecondary" style={{ textAlign: "center", marginTop: "20px" }}>
            Your cart is empty. Add some products!
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price (₹)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">{product.price.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleRemove(product.id)}>
                          <ClearRoundedIcon style={{ color: 'red' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{totalAmount.toFixed(2)}</strong>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
  
            <form onSubmit={handleCheckout} style={{ textAlign: "right", marginTop: "20px" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={selectedProducts.length === 0}
                style={{
                  backgroundColor: selectedProducts.length === 0 ? "#e0e0e0" : "#110f52",
                  color: selectedProducts.length === 0 ? "#9e9e9e" : "white",
                  marginRight: "10px"
                }}
              >
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </form>
          </>
        )}
      </div>
    );
  };
  
  export default AddToCart;
