import React, { useState } from "react";

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
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

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




const AddToCart = ({ addedItems, onBack, personalInfo, carInfo,  updateFormData }) => {
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


  const handleSubmit = () => {
    // Ensure accessories are marked as "Yes" in formData
    updateFormData("additionalInfo", "accessories", "Yes");

    // Navigate to the AdditionalInfo step (case 4)
    onBack();
  };

  

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Customer Details
      </Typography>
      <Typography variant="body1">
        <p>Customer ID: {personalInfo?.customerId}</p>
        <p>Full Name: {personalInfo?.firstName} </p>
        <p>Phone Numbers: {carInfo?.mobileNumber1}, {carInfo?.mobileNumber2}</p>
        <p>Email: {personalInfo?.email}</p>
      </Typography>

      {selectedProducts.length === 0 ? (
        <Typography
          variant="h6"
          color="textSecondary"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          Your cart is empty. Add some products!
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
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
                        <ClearRoundedIcon style={{ color: "red" }} />
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

          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <Button variant="contained" color="secondary" onClick={onBack}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddToCart;
