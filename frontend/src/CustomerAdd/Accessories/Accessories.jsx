import React, { useState, useEffect } from "react";
import { Typography, Button, Card, CardContent, CardActions, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead, Badge } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon
import { useLocation, useNavigate } from 'react-router-dom';

import '../scss/Accessories.scss'

// Sample accessories data
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

const Accessories = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [onAddToCart, setOnAddToCart] = useState(() => () => {});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const location = useLocation();
  const { fullName, email, mobile, mobile2, customerId } = location.state || {};

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddToCart = (item) => {
    if (!addedItems.includes(item.id)) {
      if (typeof onAddToCart === "function") {
        onAddToCart([
          {
            ...item,
            quantity: 1,
          },
        ]);
      } else {
        console.error("onAddToCart is not a function");
      }
      setAddedItems((prev) => [...prev, item.id]);
    }
  };

  const handleCartClick = () => {
    navigate('/add-to-cart', {
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

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="accessories">
      <div className="accessories__header">
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackClick}>
          Back
        </Button>
        <div style={{ textAlign: 'left', marginLeft: '10px', marginTop: '-26px' }}>
          <p>customer Id: {customerId}</p>
          <p>Full Name: {fullName}</p>
          <p>Phone Number: {mobile},{mobile2}</p>
          <p>Email: {email}</p>
        </div>
        <Typography gutterBottom>
          <Badge
            badgeContent={addedItems.length}
            color="error"
            style={{ cursor: 'pointer', marginTop: '-40px', marginRight: '10px' }}
          >
            <AddShoppingCartIcon style={{ color: '#110f52' }} onClick={handleCartClick} />
          </Badge>
        </Typography>
      </div>

      {isMobile ? (
        <TableContainer component={Paper} style={{ marginTop: "-2rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accessoriesData.map((item) => (
                <TableRow key={item.id} style={{ cursor: "pointer" }}>
                  <TableCell>
                    <Typography style={{ fontSize: "10px" }}>{item.name}</Typography>
                  </TableCell>
                  <TableCell style={{ fontSize: "10px" }} align="right"></TableCell>
                  <TableCell>
                    <Typography style={{ fontSize: "10px" }}>{item.name}</Typography>
                  </TableCell>
                  <TableCell style={{ fontSize: "10px" }} align="right">
                    ${item.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      startIcon={addedItems.includes(item.id) ? <CheckIcon style={{ color: "green" }} /> : <AddIcon />}
                      size="small"
                      onClick={() => handleAddToCart(item)}
                      disabled={addedItems.includes(item.id)}
                    >
                      {addedItems.includes(item.id) ? "Added" : "Add"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={4}>
          {accessoriesData.map((item) => (
            <Grid item xs={6} md={3} key={item.id}>
              <Card className="accessory-card" style={{ cursor: "pointer" }}>
                <CardContent>
                  <Typography variant="h2" style={{ inlineSize:'100%' }} gutterBottom>{item.name}</Typography>
                  <Typography variant="body1">Price: ${item.price.toFixed(2)}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={addedItems.includes(item.id) ? <CheckIcon style={{ color: "green" }} /> : <AddIcon />}
                    size="small"
                    onClick={() => handleAddToCart(item)}
                    disabled={addedItems.includes(item.id)}
                  >
                    {addedItems.includes(item.id) ? "Added" : "Add"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Accessories;
